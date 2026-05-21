import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem, User } from "@/lib/types";

const CURRENT_USER_ID = "a8b5b138-9a56-4513-a2c2-ded39ccbf012";

type Input = {
  contentIds: string[];
  assignedToId: string;
};

export function useBulkAssignContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentIds, assignedToId }: Input) =>
      Promise.all(
        contentIds.map((id) =>
          apiFetch<BackendContentItem>(`/content/${id}/assign`, {
            method: "PATCH",
            body: { assignedToId, changedById: CURRENT_USER_ID },
          })
        )
      ),

    onMutate: async ({ contentIds, assignedToId }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });

      const previousContentItems =
        queryClient.getQueriesData<BackendContentItem[]>({
          queryKey: ["content-items"],
        });

      const users = queryClient.getQueryData<User[]>(["users"]) ?? [];
      const assignedUser = users.find((user) => user.id === assignedToId);

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (oldItems) =>
          oldItems?.map((item) =>
            contentIds.includes(item.id)
              ? {
                  ...item,
                  assignedToId,
                  assignedTo: assignedUser ?? item.assignedTo,
                  updatedAt: new Date().toISOString(),
                }
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
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}