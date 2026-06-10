import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem, PaginatedContentItems } from "@/lib/types";

type UpdateStatusInput = {
  contentId: string;
  status: ContentItem["status"];
};

export function useUpdateContentStatus() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: ({ contentId, status }: UpdateStatusInput) => {
      if (!currentUser) {
        throw new Error("You must be signed in to update content");
      }

      return apiFetch<BackendContentItem>(`/content/${contentId}/status`, {
        method: "PATCH",
        body: {
          status,
          changedById: currentUser.id,
        },
      });
    },

    onMutate: async ({ contentId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });
      await queryClient.cancelQueries({ queryKey: ["content-items-paginated"] });

      const previousContentItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });
      const previousPaginatedItems = queryClient.getQueriesData<PaginatedContentItems>({
        queryKey: ["content-items-paginated"],
      });

      const patch = { status, updatedAt: new Date().toISOString() };

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (old) => old?.map((item) => item.id === contentId ? { ...item, ...patch } : item)
      );
      queryClient.setQueriesData<PaginatedContentItems>(
        { queryKey: ["content-items-paginated"] },
        (old) => old ? { ...old, items: old.items.map((item) => item.id === contentId ? { ...item, ...patch } : item) } : old
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