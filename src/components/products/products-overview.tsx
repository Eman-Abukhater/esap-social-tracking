"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/language-provider";

import type { DashboardStats, Product } from "@/lib/types";

type ProductsOverviewProps = {
  products: Product[];
  productCompletion: DashboardStats["productCompletion"];
};

export function ProductsOverview({
  products,
  productCompletion,
}: ProductsOverviewProps) {
  const t = useTranslation();
  const statsByProductId = new Map(
    productCompletion.map((entry) => [entry.productId, entry])
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const stats = statsByProductId.get(product.id);
        const total = stats?.total ?? 0;
        const published = stats?.published ?? 0;
        const completionRate = stats?.completionRate ?? 0;

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
          >
            <div className="cursor-pointer rounded-xl border bg-background p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          product.color,
                      }}
                    />

                    <h2 className="font-semibold">
                      {product.name}
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <Badge variant="outline">
                  {completionRate}%
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    {t("products.total")}
                  </p>

                  <p className="text-xl font-bold">
                    {total}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    {t("products.published")}
                  </p>

                  <p className="text-xl font-bold">
                    {published}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    {t("products.completion")}
                  </p>

                  <p className="text-xl font-bold">
                    {completionRate}%
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
