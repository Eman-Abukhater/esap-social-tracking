import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, PaginatedContentItems, User } from "@/lib/types";

type Input = {
  contentIds: string[];
  assignedToId: string;
};

export function useBulkAssignContent() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: async ({ contentIds, assignedToId }: Input) => {
      if (!currentUser) {
        throw new Error("You must be signed in to assign content");
      }

      return Promise.all(
        contentIds.map((id) =>
          apiFetch<BackendContentItem>(`/content/${id}/assign`, {
            method: "PATCH",
            body: { assignedToId },
          })
        )
      );
    },

    onMutate: async ({ contentIds, assignedToId }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });
      await queryClient.cancelQueries({ queryKey: ["content-items-paginated"] });

      const previousContentItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });
      const previousPaginatedItems = queryClient.getQueriesData<PaginatedContentItems>({
        queryKey: ["content-items-paginated"],
      });

      const users = queryClient.getQueryData<User[]>(["users"]) ?? [];
      const assignedUser = users.find((user) => user.id === assignedToId);
      const patch = (item: BackendContentItem) => ({
        ...item,
        assignedToId,
        assignedTo: assignedUser ?? item.assignedTo,
        updatedAt: new Date().toISOString(),
      });

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (old) => old?.map((item) => contentIds.includes(item.id) ? patch(item) : item)
      );
      queryClient.setQueriesData<PaginatedContentItems>(
        { queryKey: ["content-items-paginated"] },
        (old) => old ? { ...old, items: old.items.map((item) => contentIds.includes(item.id) ? patch(item) : item) } : old
      );

      return { previousContentItems, previousPaginatedItems };
    },

    onError: (_error, _variables, context) => {
      context?.previousContentItems.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousPaginatedItems.forEach(([queryKey, data]) => {
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