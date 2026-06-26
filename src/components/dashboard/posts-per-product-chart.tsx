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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import { useLanguage } from "@/providers/language-provider";

type PostsPerProductChartProps = {
  data: DashboardStats["postsPerProduct"];
};

export function PostsPerProductChart({ data }: PostsPerProductChartProps) {
  const { t, formatNumber } = useLanguage();
  const chartData = data.map((entry) => ({
    name: entry.productName,
    total: entry.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.postsPerProduct")}</CardTitle>
        <CardDescription>{t("dashboard.postsPerProductDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip formatter={(value) => [typeof value === "number" ? formatNumber(value) : value, t("dashboard.posts")]} />
              <Bar dataKey="total" radius={[10, 10, 0, 0]} maxBarSize={120}>
                {chartData.map((_entry, index) => (
                  <Cell key={index} fill={`var(--chart-${(index % 5) + 1})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
