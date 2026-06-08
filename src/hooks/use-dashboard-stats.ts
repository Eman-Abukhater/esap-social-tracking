import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

export function useDashboardStats(productId?: string) {
  const params = new URLSearchParams();

  if (productId) {
    params.append("productId", productId);
  }

  const query = params.toString();

  return useQuery({
    queryKey: ["dashboard-stats", productId ?? "all"],

    queryFn: () =>
      apiFetch<DashboardStats>(`/dashboard/stats${query ? `?${query}` : ""}`),
  });
}
