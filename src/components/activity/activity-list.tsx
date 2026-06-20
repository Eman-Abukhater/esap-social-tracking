"use client";

import type { BackendActivityLog } from "@/lib/types";
import { getChangedFields } from "@/lib/constants";
import { useTranslation } from "@/providers/language-provider";

type ActivityListProps = {
  activityLogs: BackendActivityLog[];
};

function getObjectValue(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getContentTitle(log: BackendActivityLog, unknownLabel: string) {
  const previousValue = getObjectValue(log.previousValue);
  const newValue = getObjectValue(log.newValue);

  return (
    log.contentItem?.title ??
    String(previousValue.title ?? newValue.title ?? unknownLabel)
  );
}

function formatValue(value: unknown) {
  if (!value) return "—";

  return String(value);
}

export function ActivityList({ activityLogs }: ActivityListProps) {
  const t = useTranslation();

  const fieldLabels: Record<string, string> = {
    status: t("activity.field.status"),
    title: t("activity.field.title"),
    priority: t("activity.field.priority"),
    scheduledDate: t("activity.field.scheduledDate"),
    assignedToId: t("activity.field.assignedUser"),
  };

  function formatFieldName(field: string) {
    return fieldLabels[field] ?? field;
  }

  if (activityLogs.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
        <h3 className="font-semibold">{t("activity.noActivity")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("activity.noActivityDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activityLogs.map((log) => {
        const changedFields = getChangedFields(log);
        const userName = log.changedBy?.name ?? t("activity.unknownUser");
        const contentTitle = getContentTitle(log, t("activity.unknownContent"));

        return (
          <div
            key={log.id}
            className="rounded-xl border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="font-medium">
                  {userName}{" "}
                  {log.action === "created" && t("activity.action.created")}
                  {log.action === "updated" && t("activity.action.updated")}
                  {log.action === "status_changed" && t("activity.action.statusChanged")}
                  {log.action === "assigned" && t("activity.action.assigned")}
                  {log.action === "deleted" && t("activity.action.deleted")}{" "}
                  <span className="font-semibold">
                    &ldquo;{contentTitle}&rdquo;
                  </span>
                </p>

                {changedFields.length > 0 && log.action !== "deleted" && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {changedFields.map((change) => (
                      <p key={change.field}>
                        <span className="font-medium text-foreground">
                          {formatFieldName(change.field)}
                        </span>{" "}
                        {t("activity.changedFrom")}{" "}
                        <span className="font-medium text-foreground">
                          {formatValue(change.from)}
                        </span>{" "}
                        {t("activity.to")}{" "}
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
