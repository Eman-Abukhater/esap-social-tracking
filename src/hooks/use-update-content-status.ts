import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem } from "@/lib/types";

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
      await queryClient.cancelQueries({
        queryKey: ["content-items"],
      });

      const previousContentItems =
        queryClient.getQueriesData<BackendContentItem[]>({
          queryKey: ["content-items"],
        });

      queryClient.setQueriesData<BackendContentItem[]>(
        { queryKey: ["content-items"] },
        (oldItems) => {
          if (!oldItems) return oldItems;

          return oldItems.map((item) =>
            item.id === contentId
              ? {
                  ...item,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : item
          );
        }
      );

      return { previousContentItems };
    },

    onError: (_error, _variables, context) => {
      context?.previousContentItems.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["content-items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["activity-logs"],
      });
    },
  });
}