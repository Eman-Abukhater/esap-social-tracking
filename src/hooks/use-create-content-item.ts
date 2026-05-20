import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem, ContentItem, Platform } from "@/lib/types";

const CURRENT_USER_ID = "a8b5b138-9a56-4513-a2c2-ded39ccbf012";

type CreateContentInput = {
  title: string;
  description: string;
  type: ContentItem["type"];
  productId: string;
  status: ContentItem["status"];
  platforms: Platform[];
  scheduledDate: string;
  assignedToId: string;
  priority: ContentItem["priority"];
  tags: string[];
};

export function useCreateContentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContentInput) =>
      apiFetch<BackendContentItem>("/content", {
        method: "POST",
        body: {
          ...data,
          createdById: CURRENT_USER_ID,
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