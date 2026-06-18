"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { PostsPerProductChart } from "@/components/dashboard/posts-per-product-chart";
import { ProductCompletionChart } from "@/components/dashboard/product-completion-chart";
import { StatusBreakdownChart } from "@/components/dashboard/status-breakdown-chart";
import { WeeklyOutputChart } from "@/components/dashboard/weekly-output-chart";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Social media execution overview.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-xl border bg-background p-6 text-sm text-destructive">
          Failed to load dashboard data.
        </div>
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
