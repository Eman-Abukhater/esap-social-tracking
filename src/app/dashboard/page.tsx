"use client";

import { useTranslation } from "@/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { PostsPerProductChart } from "@/components/dashboard/posts-per-product-chart";
import { ProductCompletionChart } from "@/components/dashboard/product-completion-chart";
import { StatusBreakdownChart } from "@/components/dashboard/status-breakdown-chart";
import { WeeklyOutputChart } from "@/components/dashboard/weekly-output-chart";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export default function DashboardPage() {
  const t = useTranslation();
  const { data: stats, isLoading, isError } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>

        <p className="text-muted-foreground">
          {t("dashboard.description")}
        </p>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            {t("dashboard.loading")}
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent role="alert" className="text-sm text-destructive">
            {t("dashboard.error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && stats && (
        <>
          <DashboardStats totals={stats.totals} typeBreakdown={stats.typeBreakdown} />

          <div className="grid gap-6 xl:grid-cols-2">
            <PostsPerProductChart data={stats.postsPerProduct} />

            <PlatformDistributionChart data={stats.platformDistribution} />

            <StatusBreakdownChart data={stats.statusBreakdown} />

            <WeeklyOutputChart data={stats.weeklyOutput} />

            <ProductCompletionChart data={stats.productCompletion} />
          </div>
        </>
      )}
    </div>
  );
}
