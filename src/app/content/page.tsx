"use client";

import { useState } from "react";

import { AddContentDialog } from "@/components/content/add-content-dialog";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";
import { useContentItems } from "@/hooks/use-content-items";

import type { ContentItem } from "@/lib/types";

export default function ContentPage() {
  const [filters, setFilters] = useState<ContentFiltersState>({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
  });

  const {
    data: contentItems = [],
    isLoading,
    isError,
  } = useContentItems(filters);

  function handleStatusChange(
    contentId: string,
    newStatus: ContentItem["status"]
  ) {
    console.log("Status change will be connected to backend next", {
      contentId,
      newStatus,
    });
  }

  function handleCreateContent(newContent: ContentItem) {
    console.log("Create content will be connected to backend next", newContent);
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