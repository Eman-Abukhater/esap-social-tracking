"use client";

import type { DashboardStats as DashboardStatsData } from "@/lib/types";

type DashboardStatsProps = {
  totals: DashboardStatsData["totals"];
  typeBreakdown: DashboardStatsData["typeBreakdown"];
};

export function DashboardStats({ totals, typeBreakdown }: DashboardStatsProps) {
  const totalVideos = typeBreakdown.find((t) => t.type === "video")?.total ?? 0;

  const stats = [
    {
      title: "Total Content",
      value: totals.totalContent,
    },
    {
      title: "Total Videos",
      value: totalVideos,
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
