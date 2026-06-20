"use client";

import { useTranslation } from "@/providers/language-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import { PLATFORMS } from "@/lib/constants";

export type ContentFiltersState = {
  search: string;
  productId: string;
  status: string;
  platform: string;
  assignedToId: string;
  startDate: string;
  endDate: string;
};

type ContentFiltersProps = {
  filters: ContentFiltersState;
  onFiltersChange: (filters: ContentFiltersState) => void;
};

export function ContentFilters({
  filters,
  onFiltersChange,
}: ContentFiltersProps) {
  const t = useTranslation();
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers();

  return (
    <div className="grid gap-3 rounded-xl border bg-background p-4 shadow-sm md:grid-cols-4">
      <Input
        placeholder={t("filters.searchByTitle")}
        value={filters.search}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            search: event.target.value,
          })
        }
      />

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
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={t("filters.status")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
          <SelectItem value="planned">{t("status.planned")}</SelectItem>
          <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
          <SelectItem value="review">{t("status.review")}</SelectItem>
          <SelectItem value="done">{t("status.done")}</SelectItem>
          <SelectItem value="published">{t("status.published")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.platform}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            platform: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={t("filters.platform")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allPlatforms")}</SelectItem>
          {PLATFORMS.map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.assignedToId}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            assignedToId: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={t("filters.assignedTo")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{t("filters.allAssignees")}</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        aria-label={t("filters.scheduledFrom")}
        value={filters.startDate}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            startDate: event.target.value,
          })
        }
      />

      <Input
        type="date"
        aria-label={t("filters.scheduledTo")}
        value={filters.endDate}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            endDate: event.target.value,
          })
        }
      />
    </div>
  );
}