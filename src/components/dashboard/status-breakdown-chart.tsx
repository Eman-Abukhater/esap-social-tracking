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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import { useTranslation } from "@/providers/language-provider";

type Props = {
  data: DashboardStats["statusBreakdown"];
};

export function StatusBreakdownChart({ data }: Props) {
  const t = useTranslation();
  const chartData = data.map((entry) => ({
    name: t(`status.${entry.status}`),
    total: entry.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.statusBreakdown")}</CardTitle>
        <CardDescription>{t("dashboard.statusBreakdownDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip formatter={(value) => [value, t("dashboard.posts")]} />
              <Bar dataKey="total" radius={[10, 10, 0, 0]} maxBarSize={80} fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
