"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BackendContentItem, Product } from "@/lib/types";

type PostsPerProductChartProps = {
  products: Product[];
  contentItems: BackendContentItem[];
};

export function PostsPerProductChart({
  products,
  contentItems,
}: PostsPerProductChartProps) {
  const chartData = products.map((product) => {
    const totalPosts = contentItems.filter(
      (item) => item.productId === product.id
    ).length;

    return {
      name: product.name,
      total: totalPosts,
    };
  });

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Posts Per Product
        </h2>

        <p className="text-sm text-muted-foreground">
          Content distribution across ESAP products
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}