"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { useTranslation } from "@/providers/language-provider";

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
  const t = useTranslation();
  const { data: users = [] } = useUsers();
  const { data: products = [] } = useProducts();
  const { data: contentItems = [] } = useContentItems(allContentFilters);

  return (
    <Card>
      <CardContent className="grid gap-3 md:grid-cols-3">
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
          <SelectValue placeholder={t("filters.user")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allUsers")}</SelectItem>
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
          <SelectValue placeholder={t("filters.product")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allProducts")}</SelectItem>
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
          <SelectValue placeholder={t("filters.contentItem")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allContent")}</SelectItem>
          {contentItems.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </CardContent>
    </Card>
  );
}
