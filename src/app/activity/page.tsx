"use client";

import { useState } from "react";

import { useTranslation } from "@/providers/language-provider";
import {
  ActivityFilters,
  type ActivityFiltersState,
} from "@/components/activity/activity-filters";
import { ActivityList } from "@/components/activity/activity-list";
import { useActivityLogs } from "@/hooks/use-activity-logs";

export default function ActivityPage() {
  const t = useTranslation();
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
        <h1 className="text-3xl font-bold">{t("activity.title")}</h1>

        <p className="text-muted-foreground">
          {t("activity.description")}
        </p>
      </div>

      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          {t("activity.loading")}
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-xl border bg-background p-6 text-sm text-destructive">
          {t("activity.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <ActivityList activityLogs={activityLogs} />
      )}
    </div>
  );
}