"use client";

import { useState } from "react";

import {
  ActivityFilters,
  type ActivityFiltersState,
} from "@/components/activity/activity-filters";
import { ActivityList } from "@/components/activity/activity-list";
import { useActivityLogs } from "@/hooks/use-activity-logs";

export default function ActivityPage() {
  const [filters, setFilters] = useState<ActivityFiltersState>({
    userId: "all",
    productId: "all",
    contentId: "all",
  });

  const {
    data: activityLogs = [],
    isLoading,
    isError,
  } = useActivityLogs(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity</h1>

        <p className="text-muted-foreground">
          Track all content activity and changes.
        </p>
      </div>

      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading activity logs...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load activity logs.
        </div>
      )}

      {!isLoading && !isError && (
        <ActivityList activityLogs={activityLogs} />
      )}
    </div>
  );
}