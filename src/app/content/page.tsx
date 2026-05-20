"use client";

import { useState } from "react";
import { useCreateContentItem } from "@/hooks/use-create-content-item";
import { AddContentDialog } from "@/components/content/add-content-dialog";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";
import { useContentItems } from "@/hooks/use-content-items";
import { useUpdateContentStatus } from "@/hooks/use-update-content-status";
import type { ContentItem } from "@/lib/types";

export default function ContentPage() {
  const [filters, setFilters] = useState<ContentFiltersState>({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
  });
  const createContentMutation = useCreateContentItem();
  const {
    data: contentItems = [],
    isLoading,
    isError,
  } = useContentItems(filters);
  const updateStatusMutation = useUpdateContentStatus();
  function handleStatusChange(
    contentId: string,
    newStatus: ContentItem["status"]
  ) {
    updateStatusMutation.mutate({
      contentId,
      status: newStatus,
    });
  }

function handleCreateContent(newContent: Parameters<typeof createContentMutation.mutate>[0]) {
  createContentMutation.mutate(newContent);
}

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content</h1>

          <p className="text-muted-foreground">
            Manage and track all social media content.
          </p>
        </div>

        <AddContentDialog onCreateContent={handleCreateContent} />
      </div>

      <ContentFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading content items...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load content items.
        </div>
      )}

      {!isLoading && !isError && (
        <ContentTable
          contentItems={contentItems}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}