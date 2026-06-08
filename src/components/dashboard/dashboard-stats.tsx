"use client";

import type { DashboardStats as DashboardStatsData } from "@/lib/types";

type DashboardStatsProps = {
  totals: DashboardStatsData["totals"];
};

export function DashboardStats({ totals }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Content",
      value: totals.totalContent,
    },
    {
      title: "Published",
      value: totals.published,
    },
    {
      title: "In Progress",
      value: totals.inProgress,
    },
    {
      title: "Planned",
      value: totals.planned,
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
