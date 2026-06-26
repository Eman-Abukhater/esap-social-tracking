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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";
import { useLanguage, useTranslation } from "@/providers/language-provider";

type Props = {
  data: DashboardStats["weeklyOutput"];
};

export function WeeklyOutputChart({ data }: Props) {
  const t = useTranslation();
  const { language } = useLanguage();
  const locale = language === "ar" ? "ar-SA" : "en-US";
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(locale, { month: "short", day: "numeric" }),
    total: entry.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.weeklyOutput")}</CardTitle>
        <CardDescription>{t("dashboard.weeklyOutputDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip formatter={(value) => [value, t("dashboard.posts")]} />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={3}
                stroke="var(--chart-1)"
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
