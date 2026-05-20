import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BackendActivityLog } from "@/lib/types";

export function useActivityLogs() {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => apiFetch<BackendActivityLog[]>("/activity"),
  });
}