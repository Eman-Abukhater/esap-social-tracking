"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
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
        <Card key={stat.title}>
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
