import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem } from "@/lib/types";

type Input = {
  contentIds: string[];
};

export function useBulkDeleteContent() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: async ({ contentIds }: Input) => {
      if (!currentUser) {
        throw new Error("You must be signed in to delete content");
      }

      return Promise.all(
        contentIds.map((id) =>
          apiFetch<{ message: string }>(`/content/${id}`, {
            method: "DELETE",
            body: { changedById: currentUser.id },
          })
        )
      );
    },

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