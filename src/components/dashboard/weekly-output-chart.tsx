"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BackendContentItem } from "@/lib/types";

type Props = {
  contentItems: BackendContentItem[];
};

function getDateKey(date: string) {
  return new Date(date).toLocaleDateString();
}

export function WeeklyOutputChart({ contentItems }: Props) {
  const grouped = contentItems.reduce<Record<string, number>>((acc, item) => {
    const key = getDateKey(item.createdAt);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([date, total]) => ({
    date,
    total,
  }));

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Weekly Output Trend</h2>
        <p className="text-sm text-muted-foreground">
          Content creation activity over time
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}