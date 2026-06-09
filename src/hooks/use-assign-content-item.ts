import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, User } from "@/lib/types";

type Input = { contentId: string; assignedToId: string };

export function useAssignContentItem() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: ({ contentId, assignedToId }: Input) => {
      if (!currentUser) throw new Error("You must be signed in to assign content");
      return apiFetch<BackendContentItem>(`/content/${contentId}/assign`, {
        method: "PATCH",
        body: { assignedToId, changedById: currentUser.id },
      });
    },

    onMutate: async ({ contentId, assignedToId }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });
      const previousContentItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });
      const users = queryClient.getQueryData<User[]>(["users"]) ?? [];
      const assignedUser = users.find((u) => u.id === assignedToId);
      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (oldItems) =>
          oldItems?.map((item) =>
            item.id === contentId
              ? { ...item, assignedToId, assignedTo: assignedUser ?? item.assignedTo, updatedAt: new Date().toISOString() }
              : item
          )
      );
      return { previousContentItems };
    },

    onError: (_error, _variables, context) => {
      context?.previousContentItems.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
      queryClient.invalidateQueries({ queryKey: ["content-items-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}
