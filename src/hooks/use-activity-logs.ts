import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendActivityLog } from "@/lib/types";
import type { ActivityFiltersState } from "@/components/activity/activity-filters";

const defaultFilters: ActivityFiltersState = {
  userId: "all",
  productId: "all",
  contentId: "all",
};

export function useActivityLogs(filters: ActivityFiltersState = defaultFilters) {
  const params = new URLSearchParams();

  if (filters.userId !== "all") {
    params.append("userId", filters.userId);
  }

  if (filters.productId !== "all") {
    params.append("productId", filters.productId);
  }

  if (filters.contentId !== "all") {
    params.append("contentId", filters.contentId);
  }

  return useQuery({
    queryKey: ["activity-logs", filters],

    queryFn: () =>
      apiFetch<BackendActivityLog[]>(`/activity?${params.toString()}`),
  });
}
