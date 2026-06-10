import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, PaginatedContentItems } from "@/lib/types";

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
      await queryClient.cancelQueries({ queryKey: ["content-items-paginated"] });

      const previousContentItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });
      const previousPaginatedItems = queryClient.getQueriesData<PaginatedContentItems>({
        queryKey: ["content-items-paginated"],
      });

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (old) => old?.filter((item) => !contentIds.includes(item.id))
      );
      queryClient.setQueriesData<PaginatedContentItems>(
        { queryKey: ["content-items-paginated"] },
        (old) => {
          if (!old) return old;
          const newItems = old.items.filter((item) => !contentIds.includes(item.id));
          const removed = old.items.length - newItems.length;
          const newTotal = Math.max(0, old.total - removed);
          return { ...old, items: newItems, total: newTotal, totalPages: Math.ceil(newTotal / old.pageSize) };
        }
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}