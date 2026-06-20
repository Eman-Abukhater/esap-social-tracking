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
import { useTranslation } from "@/providers/language-provider";

type Props = {
  data: DashboardStats["productCompletion"];
};

export function ProductCompletionChart({ data }: Props) {
  const t = useTranslation();
  const chartData = data.map((entry) => ({
    name: entry.productName,
    completion: entry.completionRate,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.productCompletion")}</CardTitle>
        <CardDescription>{t("dashboard.productCompletionDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="completion" radius={[10, 10, 0, 0]} maxBarSize={90}>
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
