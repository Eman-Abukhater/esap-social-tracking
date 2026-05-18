"use client";

import { useEffect, useState } from "react";

import { ProductsOverview } from "@/components/products/products-overview";
import { contentItems as initialContentItems } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/types";

export default function ProductsPage() {
  const [contentItems, setContentItems] =
    useState<ContentItem[]>(initialContentItems);

  useEffect(() => {
    const savedContentItems = localStorage.getItem("esap-content-items");

    if (savedContentItems) {
      setContentItems(JSON.parse(savedContentItems));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Track content performance across ESAP products.
        </p>
      </div>

      <ProductsOverview contentItems={contentItems} />
    </div>
  );
}