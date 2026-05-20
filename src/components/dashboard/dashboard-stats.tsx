"use client";

import type { BackendContentItem } from "@/lib/types";
type DashboardStatsProps = {
  contentItems: BackendContentItem[];
};

export function DashboardStats({
  contentItems,
}: DashboardStatsProps) {
  const totalContent = contentItems.length;

  const publishedCount = contentItems.filter(
    (item) => item.status === "published"
  ).length;

  const inProgressCount = contentItems.filter(
    (item) => item.status === "in_progress"
  ).length;

  const plannedCount = contentItems.filter(
    (item) => item.status === "planned"
  ).length;

  const stats = [
    {
      title: "Total Content",
      value: totalContent,
    },
    {
      title: "Published",
      value: publishedCount,
    },
    {
      title: "In Progress",
      value: inProgressCount,
    },
    {
      title: "Planned",
      value: plannedCount,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-background p-6 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">
            {stat.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}