import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem } from "@/lib/types";

const CURRENT_USER_ID = "a8b5b138-9a56-4513-a2c2-ded39ccbf012";

type Input = {
  contentIds: string[];
};

export function useBulkDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentIds }: Input) =>
      Promise.all(
        contentIds.map((id) =>
          apiFetch<{ message: string }>(`/content/${id}`, {
            method: "DELETE",
            body: { changedById: CURRENT_USER_ID },
          })
        )
      ),

    onMutate: async ({ contentIds }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });

      const previousContentItems =
        queryClient.getQueriesData<BackendContentItem[]>({
          queryKey: ["content-items"],
        });

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (oldItems) =>
          oldItems?.filter((item) => !contentIds.includes(item.id))
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