"use client";

import { toast } from "sonner";

import { AddProductDialog } from "@/components/products/add-product-dialog";
import { ProductsOverview } from "@/components/products/products-overview";
import { useCreateProduct } from "@/hooks/use-create-product";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useProducts } from "@/hooks/use-products";

export default function ProductsPage() {
  const createProductMutation = useCreateProduct();
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="text-muted-foreground">
            Select a product to see its execution overview.
          </p>
        </div>

        <AddProductDialog
          onCreateProduct={(data) =>
            createProductMutation.mutate(data, {
              onSuccess: () => toast.success("Product created successfully"),
              onError: () => toast.error("Failed to create product"),
            })
          }
        />
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
