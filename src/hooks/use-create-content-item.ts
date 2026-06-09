import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem, Platform } from "@/lib/types";

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
  const currentUser = useCurrentUser();

  return useMutation({
    mutationFn: (data: CreateContentInput) => {
      if (!currentUser) {
        throw new Error("You must be signed in to create content");
      }

      return apiFetch<BackendContentItem>("/content", {
        method: "POST",
        body: {
          ...data,
          createdById: currentUser.id,
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-items"] });
      queryClient.invalidateQueries({ queryKey: ["content-items-paginated"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}