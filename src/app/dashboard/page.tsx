"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PostsPerProductChart } from "@/components/dashboard/posts-per-product-chart";

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

  const {
    data: products = [],
  } = useProducts();

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

          <PostsPerProductChart
            products={products}
            contentItems={contentItems}
          />
        </>
      )}
    </div>
  );
}