"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { BackendContentItem, Platform } from "@/lib/types";

type PlatformDistributionChartProps = {
  contentItems: BackendContentItem[];
};

const platforms: Platform[] = [
  "LinkedIn",
  "X",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
];

export function PlatformDistributionChart({
  contentItems,
}: PlatformDistributionChartProps) {
  const chartData = platforms
    .map((platform) => ({
      name: platform,
      value: contentItems.filter((item) =>
        item.platforms.includes(platform)
      ).length,
    }))
    .filter((item) => item.value > 0);

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
              {chartData.map((entry) => (
                <Cell key={entry.name} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}