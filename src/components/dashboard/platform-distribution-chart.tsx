"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import { useTranslation } from "@/providers/language-provider";

type PlatformDistributionChartProps = {
  data: DashboardStats["platformDistribution"];
};

export function PlatformDistributionChart({
  data,
}: PlatformDistributionChartProps) {
  const t = useTranslation();
  const chartData = data
    .filter((entry) => entry.total > 0)
    .map((entry) => ({
      name: entry.platform,
      value: entry.total,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.platformDistribution")}</CardTitle>
        <CardDescription>{t("dashboard.platformDistributionDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={`var(--chart-${(index % 5) + 1})`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
