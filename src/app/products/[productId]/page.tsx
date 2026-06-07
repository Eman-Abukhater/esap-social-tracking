"use client";

import { useParams } from "next/navigation";

import { useProducts } from "@/hooks/use-products";
import { useContentItems } from "@/hooks/use-content-items";

import { ProductDetails } from "@/components/products/product-details";

export default function ProductDetailsPage() {
  const params = useParams();

  const productId = params.productId as string;

  const { data: products = [] } = useProducts();

  const { data: contentItems = [] } = useContentItems({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
    assignedToId: "all",
    startDate: "",
    endDate: "",
  });

  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) {
    return (
      <div className="rounded-xl border bg-background p-6">
        Product not found
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      contentItems={contentItems}
    />
  );
}