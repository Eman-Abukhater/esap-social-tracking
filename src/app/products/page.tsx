"use client";

import { toast } from "sonner";

import { useTranslation } from "@/providers/language-provider";
import { AddProductDialog } from "@/components/products/add-product-dialog";
import { ProductsOverview } from "@/components/products/products-overview";
import { useCreateProduct } from "@/hooks/use-create-product";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useProducts } from "@/hooks/use-products";

export default function ProductsPage() {
  const t = useTranslation();
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
          <h1 className="text-3xl font-bold">{t("products.title")}</h1>

          <p className="text-muted-foreground">
            {t("products.description")}
          </p>
        </div>

        <AddProductDialog
          onCreateProduct={(data) =>
            createProductMutation.mutate(data, {
              onSuccess: () => toast.success(t("products.toast.created")),
              onError: () => toast.error(t("products.toast.createFailed")),
            })
          }
        />
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          {t("products.loading")}
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-xl border bg-background p-6 text-sm text-destructive">
          {t("products.error")}
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
