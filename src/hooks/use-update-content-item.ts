import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem } from "@/lib/types";

type UpdateContentInput = {
  contentId: string;
  data: Partial<Pick<ContentItem, "title" | "priority" | "scheduledDate">>;
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
        body: {
          ...data,
          changedById: currentUser.id,
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