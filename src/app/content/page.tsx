"use client";

import { useState } from "react";

import { AddContentDialog } from "@/components/content/add-content-dialog";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";

import { useBulkAssignContent } from "@/hooks/use-bulk-assign-content";
import { useBulkDeleteContent } from "@/hooks/use-bulk-delete-content";
import { useBulkUpdateStatus } from "@/hooks/use-bulk-update-status";
import { useContentItems } from "@/hooks/use-content-items";
import { useCreateContentItem } from "@/hooks/use-create-content-item";
import { useUpdateContentStatus } from "@/hooks/use-update-content-status";
import { useUsers } from "@/hooks/use-users";

import type { ContentItem } from "@/lib/types";

export default function ContentPage() {
  const [filters, setFilters] = useState<ContentFiltersState>({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
  });

  const createContentMutation = useCreateContentItem();
  const updateStatusMutation = useUpdateContentStatus();
  const bulkUpdateStatusMutation = useBulkUpdateStatus();
  const bulkAssignMutation = useBulkAssignContent();
  const bulkDeleteMutation = useBulkDeleteContent();

  const {
    data: contentItems = [],
    isLoading,
    isError,
  } = useContentItems(filters);

  const { data: users = [] } = useUsers();

  function handleStatusChange(
    contentId: string,
    newStatus: ContentItem["status"]
  ) {
    updateStatusMutation.mutate({
      contentId,
      status: newStatus,
    });
  }

  function handleCreateContent(
    newContent: Parameters<typeof createContentMutation.mutate>[0]
  ) {
    createContentMutation.mutate(newContent);
  }

  function handleBulkStatusChange(
    contentIds: string[],
    status: ContentItem["status"]
  ) {
    bulkUpdateStatusMutation.mutate({
      contentIds,
      status,
    });
  }

  function handleBulkAssign(contentIds: string[], assignedToId: string) {
    bulkAssignMutation.mutate({
      contentIds,
      assignedToId,
    });
  }

  function handleBulkDelete(contentIds: string[]) {
    bulkDeleteMutation.mutate({
      contentIds,
    });
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
          users={users}
          onStatusChange={handleStatusChange}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkAssign={handleBulkAssign}
          onBulkDelete={handleBulkDelete}
        />
      )}
    </div>
  );
}