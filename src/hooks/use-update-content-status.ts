import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem, ContentItem } from "@/lib/types";

const CURRENT_USER_ID = "b5a15940-fdac-4cfb-9d50-89e8c700a004";

type UpdateStatusInput = {
  contentId: string;
  status: ContentItem["status"];
};

export function useUpdateContentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, status }: UpdateStatusInput) =>
      apiFetch<BackendContentItem>(`/content/${contentId}/status`, {
        method: "PATCH",
        body: {
          status,
          changedById: CURRENT_USER_ID,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content-items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["activity-logs"],
      });
    },
  });
}