"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AddContentDialog } from "@/components/content/add-content-dialog";
import { ContentDetailSheet } from "@/components/content/content-detail-sheet";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";

import { useAssignContentItem } from "@/hooks/use-assign-content-item";
import { useBulkAssignContent } from "@/hooks/use-bulk-assign-content";
import { useBulkDeleteContent } from "@/hooks/use-bulk-delete-content";
import { useBulkUpdateStatus } from "@/hooks/use-bulk-update-status";
import { usePaginatedContentItems } from "@/hooks/use-paginated-content-items";
import { useCreateContentItem } from "@/hooks/use-create-content-item";
import { useUpdateContentItem } from "@/hooks/use-update-content-item";
import { useUpdateContentStatus } from "@/hooks/use-update-content-status";
import { useUsers } from "@/hooks/use-users";

import type { BackendContentItem, ContentItem } from "@/lib/types";

const EMPTY_PAGE = { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

export default function ContentPage() {
  const [filters, setFilters] = useState<ContentFiltersState>({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
    assignedToId: "all",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailItem, setDetailItem] = useState<BackendContentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  function handleFiltersChange(newFilters: ContentFiltersState) {
    setFilters(newFilters);
    setPage(1);
  }

  const createContentMutation = useCreateContentItem();
  const updateStatusMutation = useUpdateContentStatus();
  const updateContentMutation = useUpdateContentItem();
  const assignMutation = useAssignContentItem();
  const bulkUpdateStatusMutation = useBulkUpdateStatus();
  const bulkAssignMutation = useBulkAssignContent();
  const bulkDeleteMutation = useBulkDeleteContent();

  const {
    data: paginatedData = EMPTY_PAGE,
    isLoading,
    isError,
  } = usePaginatedContentItems(filters, page, pageSize);

  const { items: contentItems, total, totalPages } = paginatedData;

  const { data: users = [] } = useUsers();

  function handleStatusChange(
    contentId: string,
    newStatus: ContentItem["status"]
  ) {
    updateStatusMutation.mutate(
      {
        contentId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      }
    );
  }

  function handleTitleChange(contentId: string, title: string) {
    updateContentMutation.mutate(
      {
        contentId,
        data: {
          title,
        },
      },
      {
        onSuccess: () => {
          toast.success("Title updated successfully");
        },
        onError: () => {
          toast.error("Failed to update title");
        },
      }
    );
  }

  function handlePriorityChange(
    contentId: string,
    priority: ContentItem["priority"]
  ) {
    updateContentMutation.mutate(
      { contentId, data: { priority } },
      {
        onSuccess: () => toast.success("Priority updated"),
        onError: () => toast.error("Failed to update priority"),
      }
    );
  }

  function handleTypeChange(contentId: string, type: ContentItem["type"]) {
    updateContentMutation.mutate(
      { contentId, data: { type } },
      {
        onSuccess: () => toast.success("Type updated"),
        onError: () => toast.error("Failed to update type"),
      }
    );
  }

  function handleScheduledDateChange(contentId: string, date: string) {
    updateContentMutation.mutate(
      { contentId, data: { scheduledDate: date } },
      {
        onSuccess: () => toast.success("Date updated"),
        onError: () => toast.error("Failed to update date"),
      }
    );
  }

  function handlePlatformsChange(contentId: string, platforms: import("@/lib/types").Platform[]) {
    updateContentMutation.mutate(
      { contentId, data: { platforms } },
      {
        onSuccess: () => toast.success("Platforms updated"),
        onError: () => toast.error("Failed to update platforms"),
      }
    );
  }

  function handleCreateContent(
    newContent: Parameters<typeof createContentMutation.mutate>[0]
  ) {
    createContentMutation.mutate(newContent, {
      onSuccess: () => {
        toast.success("Content created successfully");
      },
      onError: () => {
        toast.error("Failed to create content");
      },
    });
  }

  function handleBulkStatusChange(
    contentIds: string[],
    status: ContentItem["status"]
  ) {
    bulkUpdateStatusMutation.mutate(
      {
        contentIds,
        status,
      },
      {
        onSuccess: () => {
          toast.success("Bulk status updated");
        },
        onError: () => {
          toast.error("Failed to update selected items");
        },
      }
    );
  }

  function handleAssignChange(contentId: string, assignedToId: string) {
    assignMutation.mutate(
      { contentId, assignedToId },
      {
        onSuccess: () => toast.success("Assignee updated"),
        onError: () => toast.error("Failed to update assignee"),
      }
    );
  }

  function handleBulkAssign(contentIds: string[], assignedToId: string) {
    bulkAssignMutation.mutate(
      {
        contentIds,
        assignedToId,
      },
      {
        onSuccess: () => {
          toast.success("Selected items assigned");
        },
        onError: () => {
          toast.error("Failed to assign selected items");
        },
      }
    );
  }

  function handleOpenDetails(item: BackendContentItem) {
    setDetailItem(item);
    setIsDetailOpen(true);
  }

  function handleBulkDelete(contentIds: string[]) {
    bulkDeleteMutation.mutate(
      {
        contentIds,
      },
      {
        onSuccess: () => {
          toast.success("Selected items deleted");
        },
        onError: () => {
          toast.error("Failed to delete selected items");
        },
      }
    );
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

      <ContentFilters filters={filters} onFiltersChange={handleFiltersChange} />

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
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          users={users}
          onStatusChange={handleStatusChange}
          onTitleChange={handleTitleChange}
          onTypeChange={handleTypeChange}
          onPriorityChange={handlePriorityChange}
          onScheduledDateChange={handleScheduledDateChange}
          onPlatformsChange={handlePlatformsChange}
          onAssignChange={handleAssignChange}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkAssign={handleBulkAssign}
          onBulkDelete={handleBulkDelete}
          onOpenDetails={handleOpenDetails}
        />
      )}

      <ContentDetailSheet
        key={detailItem?.id ?? "empty"}
        item={detailItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}