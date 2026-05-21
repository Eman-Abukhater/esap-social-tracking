import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem, ContentItem } from "@/lib/types";

const CURRENT_USER_ID = "a8b5b138-9a56-4513-a2c2-ded39ccbf012";

type Input = {
  contentIds: string[];
  status: ContentItem["status"];
};

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentIds, status }: Input) =>
      Promise.all(
        contentIds.map((id) =>
          apiFetch<BackendContentItem>(`/content/${id}/status`, {
            method: "PATCH",
            body: { status, changedById: CURRENT_USER_ID },
          })
        )
      ),

    onMutate: async ({ contentIds, status }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });

      const previousContentItems =
        queryClient.getQueriesData<BackendContentItem[]>({
          queryKey: ["content-items"],
        });

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (oldItems) =>
          oldItems?.map((item) =>
            contentIds.includes(item.id)
              ? { ...item, status, updatedAt: new Date().toISOString() }
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