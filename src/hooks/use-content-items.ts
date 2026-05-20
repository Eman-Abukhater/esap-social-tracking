import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendContentItem } from "@/lib/types";
import type { ContentFiltersState } from "@/components/content/content-filters";

export function useContentItems(filters: ContentFiltersState) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.productId !== "all") {
    params.append("productId", filters.productId);
  }

  if (filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.platform !== "all") {
    params.append("platform", filters.platform);
  }

  return useQuery({
    queryKey: ["content-items", filters],

    queryFn: () =>
    apiFetch<BackendContentItem[]>(`/content?${params.toString()}`),
  });
}