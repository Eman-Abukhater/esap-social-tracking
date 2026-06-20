import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem, PaginatedContentItems } from "@/lib/types";

type UpdateContentInput = {
  contentId: string;
  data: Partial<Pick<ContentItem, "title" | "type" | "priority" | "platforms" | "scheduledDate" | "description" | "notes" | "mediaUrl" | "tags" | "order">>;
};

export function useUpdateContentItem() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: ({ contentId, data }: UpdateContentInput) => {
      if (!currentUser) {
        throw new Error("You must be signed in to update content");
      }

      return apiFetch<BackendContentItem>(`/content/${contentId}`, {
        method: "PATCH",
        body: data,
      });
    },

    onMutate: async ({ contentId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });
      await queryClient.cancelQueries({ queryKey: ["content-items-paginated"] });

      const previousItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });
      const previousPaginatedItems = queryClient.getQueriesData<PaginatedContentItems>({
        queryKey: ["content-items-paginated"],
      });

      const patch = { ...data, updatedAt: new Date().toISOString() };

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (old) => old?.map((item) => (item.id === contentId ? { ...item, ...patch } : item))
      );

      queryClient.setQueriesData<PaginatedContentItems>(
        { queryKey: ["content-items-paginated"] },
        (old) =>
          old
            ? { ...old, items: old.items.map((item) => (item.id === contentId ? { ...item, ...patch } : item)) }
            : old
      );

      return { previousItems, previousPaginatedItems };
    },

    onError: (_error, _variables, context) => {
      context?.previousItems.forEach(([queryKey, data]) => {
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
