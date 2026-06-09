import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem } from "@/lib/types";

type Input = {
  contentIds: string[];
  status: ContentItem["status"];
};

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: async ({ contentIds, status }: Input) => {
      if (!currentUser) {
        throw new Error("You must be signed in to update content");
      }

      return Promise.all(
        contentIds.map((id) =>
          apiFetch<BackendContentItem>(`/content/${id}/status`, {
            method: "PATCH",
            body: { status, changedById: currentUser.id },
          })
        )
      );
    },

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
      queryClient.invalidateQueries({ queryKey: ["content-items-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}