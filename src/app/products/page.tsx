"use client";

import { ProductsOverview } from "@/components/products/products-overview";
import { useContentItems } from "@/hooks/use-content-items";
import { useProducts } from "@/hooks/use-products";

export default function ProductsPage() {
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  const {
    data: contentItems = [],
    isLoading: isContentLoading,
    isError: isContentError,
  } = useContentItems({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
    assignedToId: "all",
    startDate: "",
    endDate: "",
  });

  const isLoading = isProductsLoading || isContentLoading;
  const isError = isProductsError || isContentError;

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
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load products.
        </div>
      )}

      {!isLoading && !isError && (
        <ProductsOverview products={products} contentItems={contentItems} />
      )}
    </div>
  );
}
