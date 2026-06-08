"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContentItems } from "@/hooks/use-content-items";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";

export type ActivityFiltersState = {
  userId: string;
  productId: string;
  contentId: string;
};

type ActivityFiltersProps = {
  filters: ActivityFiltersState;
  onFiltersChange: (filters: ActivityFiltersState) => void;
};

const allContentFilters = {
  search: "",
  productId: "all",
  status: "all",
  platform: "all",
  assignedToId: "all",
  startDate: "",
  endDate: "",
};

export function ActivityFilters({
  filters,
  onFiltersChange,
}: ActivityFiltersProps) {
  const { data: users = [] } = useUsers();
  const { data: products = [] } = useProducts();
  const { data: contentItems = [] } = useContentItems(allContentFilters);

  return (
    <div className="grid gap-3 rounded-xl border bg-background p-4 shadow-sm md:grid-cols-3">
      <Select
        value={filters.userId}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            userId: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="User" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.productId}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            productId: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Product" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.contentId}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            contentId: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Content item" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Content</SelectItem>
          {contentItems.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
