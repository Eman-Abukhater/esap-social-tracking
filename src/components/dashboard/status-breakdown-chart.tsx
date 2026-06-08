"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardStats } from "@/lib/types";

type Props = {
  data: DashboardStats["statusBreakdown"];
};

function getStatusLabel(status: string) {
  return status.replace("_", " ");
}

export function StatusBreakdownChart({ data }: Props) {
  const chartData = data.map((entry) => ({
    name: getStatusLabel(entry.status),
    total: entry.total,
  }));

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Status Breakdown</h2>
        <p className="text-sm text-muted-foreground">
          Current content pipeline status
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" radius={[10, 10, 0, 0]} maxBarSize={80} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
