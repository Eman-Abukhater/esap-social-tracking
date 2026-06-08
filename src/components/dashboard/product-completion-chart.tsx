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
  data: DashboardStats["productCompletion"];
};

export function ProductCompletionChart({ data }: Props) {
  const chartData = data.map((entry) => ({
    name: entry.productName,
    completion: entry.completionRate,
  }));

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Product Completion</h2>
        <p className="text-sm text-muted-foreground">
          Published content percentage per product
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="completion" radius={[10, 10, 0, 0]} maxBarSize={90} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
