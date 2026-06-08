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

import type { DashboardStats } from "@/lib/types";

type Props = {
  data: DashboardStats["weeklyOutput"];
};

export function WeeklyOutputChart({ data }: Props) {
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    total: entry.total,
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
