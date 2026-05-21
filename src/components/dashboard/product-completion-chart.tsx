"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BackendContentItem, Product } from "@/lib/types";

type Props = {
  products: Product[];
  contentItems: BackendContentItem[];
};

export function ProductCompletionChart({ products, contentItems }: Props) {
  const chartData = products.map((product) => {
    const productContent = contentItems.filter(
      (item) => item.productId === product.id
    );

    const published = productContent.filter(
      (item) => item.status === "published"
    ).length;

    const completion =
      productContent.length === 0
        ? 0
        : Math.round((published / productContent.length) * 100);

    return {
      name: product.name,
      completion,
    };
  });

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Product Completion</h2>
        <p className="text-sm text-muted-foreground">
          Published content percentage per product
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="completion" radius={[10, 10, 0, 0]} maxBarSize={90} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}