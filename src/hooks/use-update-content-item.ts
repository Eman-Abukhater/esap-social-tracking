import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem, ContentItem } from "@/lib/types";

const CURRENT_USER_ID = "a8b5b138-9a56-4513-a2c2-ded39ccbf012";

type UpdateContentInput = {
  contentId: string;
  data: Partial<Pick<ContentItem, "title" | "priority" | "scheduledDate">>;
};

export function useUpdateContentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contentId, data }: UpdateContentInput) =>
      apiFetch<BackendContentItem>(`/content/${contentId}`, {
        method: "PATCH",
        body: {
          ...data,
          changedById: CURRENT_USER_ID,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}