"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { DashboardStats } from "@/lib/types";

type PlatformDistributionChartProps = {
  data: DashboardStats["platformDistribution"];
};

export function PlatformDistributionChart({
  data,
}: PlatformDistributionChartProps) {
  const chartData = data
    .filter((entry) => entry.total > 0)
    .map((entry) => ({
      name: entry.platform,
      value: entry.total,
    }));

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Platform Distribution
        </h2>

        <p className="text-sm text-muted-foreground">
          Content distribution across social platforms
        </p>
      </div>

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
    </div>
  );
}
