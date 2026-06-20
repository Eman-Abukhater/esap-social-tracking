"use client";

import type { DashboardStats as DashboardStatsData } from "@/lib/types";
import { useTranslation } from "@/providers/language-provider";

type DashboardStatsProps = {
  totals: DashboardStatsData["totals"];
  typeBreakdown: DashboardStatsData["typeBreakdown"];
};

export function DashboardStats({ totals, typeBreakdown }: DashboardStatsProps) {
  const t = useTranslation();
  const totalVideos = typeBreakdown.find((t) => t.type === "video")?.total ?? 0;

  const stats = [
    {
      title: t("dashboard.totalContent"),
      value: totals.totalContent,
    },
    {
      title: t("dashboard.totalVideos"),
      value: totalVideos,
    },
    {
      title: t("dashboard.published"),
      value: totals.published,
    },
    {
      title: t("dashboard.inProgress"),
      value: totals.inProgress,
    },
    {
      title: t("dashboard.planned"),
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
