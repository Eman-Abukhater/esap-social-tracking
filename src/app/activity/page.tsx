"use client";

import { useEffect, useState } from "react";

import { ActivityList } from "@/components/activity/activity-list";

import type { ActivityLog } from "@/lib/types";

export default function ActivityPage() {
  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem(
      "esap-activity-logs"
    );

    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Activity
        </h1>

        <p className="text-muted-foreground">
          Track all content activity and changes.
        </p>
      </div>

      <ActivityList activityLogs={activityLogs} />
    </div>
  );
}