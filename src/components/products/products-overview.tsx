"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            <Card className="cursor-pointer transition hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: product.color }}
                  />
                  <CardTitle className="font-semibold">{product.name}</CardTitle>
                </div>
                <CardDescription>{product.description}</CardDescription>
                <CardAction>
                  <Badge variant="outline">{completionRate}%</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("products.total")}</p>
                    <p className="text-xl font-bold">{total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("products.published")}</p>
                    <p className="text-xl font-bold">{published}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("products.completion")}</p>
                    <p className="text-xl font-bold">{completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
