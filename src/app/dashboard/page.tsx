"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { PostsPerProductChart } from "@/components/dashboard/posts-per-product-chart";
import { ProductCompletionChart } from "@/components/dashboard/product-completion-chart";
import { StatusBreakdownChart } from "@/components/dashboard/status-breakdown-chart";
import { WeeklyOutputChart } from "@/components/dashboard/weekly-output-chart";

import { useContentItems } from "@/hooks/use-content-items";
import { useProducts } from "@/hooks/use-products";

export default function DashboardPage() {
  const {
    data: contentItems = [],
    isLoading,
    isError,
  } = useContentItems({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
  });

  const { data: products = [] } = useProducts();

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
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load dashboard data.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <DashboardStats contentItems={contentItems} />

          <div className="grid gap-6 xl:grid-cols-2">
            <PostsPerProductChart
              products={products}
              contentItems={contentItems}
            />

            <PlatformDistributionChart contentItems={contentItems} />

            <StatusBreakdownChart contentItems={contentItems} />

            <WeeklyOutputChart contentItems={contentItems} />

            <ProductCompletionChart
              products={products}
              contentItems={contentItems}
            />
          </div>
        </>
      )}
    </div>
  );
}