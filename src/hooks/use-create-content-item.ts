import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/providers/auth-provider";
import type { BackendContentItem, ContentItem, Platform, Product, User } from "@/lib/types";

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
        body: { ...data, createdById: currentUser.id },
      });
    },

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["content-items"] });

      const previousItems = queryClient.getQueriesData<BackendContentItem[]>({
        queryKey: ["content-items"],
      });

      if (currentUser) {
        const users = queryClient.getQueryData<User[]>(["users"]) ?? [];
        const products = queryClient.getQueryData<Product[]>(["products"]) ?? [];
        const assignedUser = users.find((u) => u.id === data.assignedToId);
        const product = products.find((p) => p.id === data.productId);

        if (product) {
          const now = new Date().toISOString();
          const tempItem: BackendContentItem = {
            id: `temp-${Date.now()}`,
            title: data.title,
            description: data.description,
            type: data.type,
            productId: data.productId,
            status: data.status,
            platforms: data.platforms,
            scheduledDate: data.scheduledDate || undefined,
            publishedDate: undefined,
            createdBy: currentUser,
            assignedTo: assignedUser ?? currentUser,
            priority: data.priority,
            tags: data.tags,
            mediaUrl: undefined,
            notes: undefined,
            createdAt: now,
            updatedAt: now,
            product,
          };

          queryClient.setQueriesData<BackendContentItem[]>(
            { queryKey: ["content-items"] },
            (old) => (old ? [tempItem, ...old] : [tempItem])
          );
        }
      }

      return { previousItems };
    },

    onError: (_error, _variables, context) => {
      context?.previousItems.forEach(([queryKey, data]) => {
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
