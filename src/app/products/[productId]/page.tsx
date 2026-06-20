"use client";

import { useParams } from "next/navigation";

import { useTranslation } from "@/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useContentItems } from "@/hooks/use-content-items";

import { ProductDetails } from "@/components/products/product-details";

export default function ProductDetailsPage() {
  const t = useTranslation();
  const params = useParams();

  const productId = params.productId as string;

  const { data: products = [] } = useProducts();

  const { data: contentItems = [] } = useContentItems({
    search: "",
    productId,
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
      <Card>
        <CardContent>{t("products.notFound")}</CardContent>
      </Card>
    );
  }

  return (
    <ProductDetails
      product={product}
      contentItems={contentItems}
    />
  );
}