"use client";

import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardStats } from "@/lib/types";

type PostsPerProductChartProps = {
  data: DashboardStats["postsPerProduct"];
};

export function PostsPerProductChart({ data }: PostsPerProductChartProps) {
  const chartData = data.map((entry) => ({
    name: entry.productName,
    total: entry.total,
  }));

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Posts Per Product
        </h2>

        <p className="text-sm text-muted-foreground">
          Content distribution across ESAP products
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip />

            <Bar dataKey="total" radius={[10, 10, 0, 0]} maxBarSize={120}>
              {chartData.map((_entry, index) => (
                <Cell key={index} fill={`var(--chart-${(index % 5) + 1})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
