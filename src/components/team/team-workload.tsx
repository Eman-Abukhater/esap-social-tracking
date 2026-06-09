"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import type { BackendContentItem, ContentStatus, User } from "@/lib/types";

type Props = {
  users: User[];
  contentItems: BackendContentItem[];
};

const STATUSES: ContentStatus[] = ["planned", "in_progress", "review", "done", "published"];

const STATUS_LABELS: Record<ContentStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  published: "Published",
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-blue-500",
  review: "bg-yellow-500",
  done: "bg-emerald-500",
  published: "bg-green-600",
};

export function TeamWorkload({ users, contentItems }: Props) {
  const workloadByUser = useMemo(() => {
    const map = new Map<string, Record<ContentStatus, number>>();

    for (const user of users) {
      map.set(
        user.id,
        Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<ContentStatus, number>
      );
    }

    for (const item of contentItems) {
      const userId = typeof item.assignedTo === "object" ? item.assignedTo?.id : item.assignedTo;
      if (userId && map.has(userId)) {
        map.get(userId)![item.status as ContentStatus] += 1;
      }
    }

    return map;
  }, [users, contentItems]);

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold">Workload</h2>
        <p className="text-sm text-muted-foreground">Active content assigned per team member</p>
      </div>

      <div className="divide-y">
        {users.map((user) => {
          const counts = workloadByUser.get(user.id)!;
          const total = STATUSES.reduce((sum, s) => sum + counts[s], 0);

          return (
            <div key={user.id} className="flex flex-wrap items-center gap-6 px-6 py-4">
              <div className="flex w-44 items-center gap-3 shrink-0">
                <UserAvatar user={user} size="default" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
                </div>
              </div>

              <Badge variant="outline" className="shrink-0 tabular-nums">
                {total} item{total !== 1 ? "s" : ""}
              </Badge>

              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => {
                  const count = counts[status];
                  if (count === 0) return null;
                  return (
                    <div key={status} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
                      <span className="text-sm text-muted-foreground">
                        {STATUS_LABELS[status]}: <span className="font-medium text-foreground">{count}</span>
                      </span>
                    </div>
                  );
                })}
                {total === 0 && (
                  <span className="text-sm text-muted-foreground">No assignments</span>
                )}
              </div>

              {total > 0 && (
                <div className="flex h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  {STATUSES.map((status) => {
                    const count = counts[status];
                    if (count === 0) return null;
                    const pct = (count / total) * 100;
                    return (
                      <div
                        key={status}
                        title={`${STATUS_LABELS[status]}: ${count}`}
                        className={`${STATUS_COLORS[status]} h-full`}
                        style={{ width: `${pct}%` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
