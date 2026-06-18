"use client";

import type { BackendActivityLog } from "@/lib/types";
import { getChangedFields } from "@/lib/constants";

type ActivityListProps = {
  activityLogs: BackendActivityLog[];
};

function getObjectValue(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getContentTitle(log: BackendActivityLog) {
  const previousValue = getObjectValue(log.previousValue);
  const newValue = getObjectValue(log.newValue);

  return (
    log.contentItem?.title ??
    String(previousValue.title ?? newValue.title ?? "Unknown content")
  );
}

function formatFieldName(field: string) {
  const labels: Record<string, string> = {
    status: "Status",
    title: "Title",
    priority: "Priority",
    scheduledDate: "Scheduled date",
    assignedToId: "Assigned user",
  };

  return labels[field] ?? field;
}

function formatValue(value: unknown) {
  if (!value) return "—";

  return String(value);
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
        const contentTitle = getContentTitle(log);

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

                {changedFields.length > 0 && log.action !== "deleted" && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {changedFields.map((change) => (
                      <p key={change.field}>
                        <span className="font-medium text-foreground">
                          {formatFieldName(change.field)}
                        </span>{" "}
                        changed from{" "}
                        <span className="font-medium text-foreground">
                          {formatValue(change.from)}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-foreground">
                          {formatValue(change.to)}
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