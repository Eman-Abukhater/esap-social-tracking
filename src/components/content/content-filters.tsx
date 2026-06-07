"use client";

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
import type { Platform } from "@/lib/types";

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

const platforms: Platform[] = [
  "LinkedIn",
  "X",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
];

export function ContentFilters({
  filters,
  onFiltersChange,
}: ContentFiltersProps) {
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers();

  return (
    <div className="grid gap-3 rounded-xl border bg-background p-4 shadow-sm md:grid-cols-4">
      <Input
        placeholder="Search by title..."
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
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value,
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="planned">Planned</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
          <SelectItem value="published">Published</SelectItem>
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
          <SelectValue placeholder="Platform" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          {platforms.map((platform) => (
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
          <SelectValue placeholder="Assigned To" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        aria-label="Scheduled from"
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
        aria-label="Scheduled to"
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