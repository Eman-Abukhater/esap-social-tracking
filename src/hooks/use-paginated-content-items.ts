import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ContentFiltersState } from "@/components/content/content-filters";
import type { PaginatedContentItems } from "@/lib/types";

export function usePaginatedContentItems(
  filters: ContentFiltersState,
  page: number,
  pageSize: number
) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.productId !== "all") params.append("productId", filters.productId);
  if (filters.status !== "all") params.append("status", filters.status);
  if (filters.platform !== "all") params.append("platform", filters.platform);
  if (filters.assignedToId !== "all") params.append("assignedToId", filters.assignedToId);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  params.append("page", String(page));
  params.append("pageSize", String(pageSize));

  return useQuery({
    queryKey: ["content-items-paginated", filters, page, pageSize],
    queryFn: () => apiFetch<PaginatedContentItems>(`/content?${params.toString()}`),
  });
}
