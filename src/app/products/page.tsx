"use client";

import { ProductsOverview } from "@/components/products/products-overview";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useProducts } from "@/hooks/use-products";

export default function ProductsPage() {
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useDashboardStats();

  const isLoading = isProductsLoading || isStatsLoading;
  const isError = isProductsError || isStatsError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>

        <p className="text-muted-foreground">
          Select a product to see its execution overview.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading products...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-xl border bg-background p-6 text-sm text-destructive">
          Failed to load products.
        </div>
      )}

      {!isLoading && !isError && stats && (
        <ProductsOverview
          products={products}
          productCompletion={stats.productCompletion}
        />
      )}
    </div>
  );
}
