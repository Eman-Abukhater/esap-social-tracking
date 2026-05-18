"use client";

import type { ActivityLog } from "@/lib/types";

type ActivityListProps = {
  activityLogs: ActivityLog[];
};

export function ActivityList({
  activityLogs,
}: ActivityListProps) {
  return (
    <div className="space-y-4">
      {activityLogs.map((log) => (
        <div
          key={log.id}
          className="rounded-xl border bg-background p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">
                {log.action === "created"
                  ? "Created new content"
                  : "Changed content status"}
              </p>

              <p className="text-sm text-muted-foreground">
                Changed by: {log.changedBy}
              </p>

              {log.action === "status_changed" && (
                <p className="text-sm">
                  Status changed from{" "}
                  <span className="font-medium">
                    {String(
                     (log.previousValue as any)?.status ?? ""
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {String(
                     (log.newValue as any)?.status ?? ""
                    )}
                  </span>
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}