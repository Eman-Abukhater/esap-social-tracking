"use client";

import type { BackendActivityLog } from "@/lib/types";

type ActivityListProps = {
  activityLogs: BackendActivityLog[];
};

function getChangedFields(log: BackendActivityLog) {
  if (!log.previousValue || !log.newValue) return [];

  const previousValue = log.previousValue as Record<string, unknown>;
  const newValue = log.newValue as Record<string, unknown>;

  return Object.keys(newValue).map((key) => ({
    field: key,
    oldValue: previousValue[key],
    newValue: newValue[key],
  }));
}

export function ActivityList({ activityLogs }: ActivityListProps) {
  if (activityLogs.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
        <h3 className="font-semibold">No activity yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes will appear here once content is created or updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activityLogs.map((log) => {
        const changedFields = getChangedFields(log);
        const userName = log.changedBy?.name ?? "Unknown user";
        const contentTitle = log.contentItem?.title ?? "Unknown content";

        return (
          <div
            key={log.id}
            className="rounded-xl border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {userName}{" "}
                  {log.action === "created" && "created"}
                  {log.action === "updated" && "updated"}
                  {log.action === "status_changed" && "changed status of"}
                  {log.action === "assigned" && "assigned"}
                  {log.action === "deleted" && "deleted"}{" "}
                  <span className="font-semibold">
                    “{contentTitle}”
                  </span>
                </p>

                {changedFields.length > 0 && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {changedFields.map((change) => (
                      <p key={change.field}>
                        <span className="font-medium text-foreground">
                          {change.field}
                        </span>{" "}
                        changed from{" "}
                        <span className="font-medium text-foreground">
                          {String(change.oldValue ?? "—")}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-foreground">
                          {String(change.newValue ?? "—")}
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}