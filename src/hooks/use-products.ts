import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => apiFetch<Product[]>("/products"),
  });
}