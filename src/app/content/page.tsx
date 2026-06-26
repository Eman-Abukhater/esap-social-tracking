"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/providers/language-provider";

import { AddContentDialog } from "@/components/content/add-content-dialog";
import { ContentDetailSheet } from "@/components/content/content-detail-sheet";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Card, CardContent } from "@/components/ui/card";
import { useAssignContentItem } from "@/hooks/use-assign-content-item";
import { useBulkAssignContent } from "@/hooks/use-bulk-assign-content";
import { useBulkDeleteContent } from "@/hooks/use-bulk-delete-content";
import { useBulkUpdateStatus } from "@/hooks/use-bulk-update-status";
import { usePaginatedContentItems } from "@/hooks/use-paginated-content-items";
import { useCreateContentItem } from "@/hooks/use-create-content-item";
import { useUpdateContentItem } from "@/hooks/use-update-content-item";
import { useUpdateContentStatus } from "@/hooks/use-update-content-status";
import { useUsers } from "@/hooks/use-users";

import type { BackendContentItem, ContentItem, Platform } from "@/lib/types";

const EMPTY_PAGE = { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

function isPermissionError(error: unknown): boolean {
  return error instanceof Error &&
    error.message.toLowerCase().includes("permission");
}

export default function ContentPage() {
  const t = useTranslation();

  function showError(error: unknown, fallbackKey: string) {
    if (isPermissionError(error)) {
      toast.warning(t("common.permissionDeniedOwnership"));
    } else {
      toast.error(t(fallbackKey));
    }
  }
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
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);

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
          toast.success(t("content.toast.statusUpdated"));
        },
        onError: (error) => {
          showError(error, "content.toast.statusFailed");
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
          toast.success(t("content.toast.titleUpdated"));
        },
        onError: (error) => {
          showError(error, "content.toast.titleFailed");
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
        onSuccess: () => toast.success(t("content.toast.priorityUpdated")),
        onError: (error) => showError(error, "content.toast.priorityFailed"),
      }
    );
  }

  function handleTypeChange(contentId: string, type: ContentItem["type"]) {
    updateContentMutation.mutate(
      { contentId, data: { type } },
      {
        onSuccess: () => toast.success(t("content.toast.typeUpdated")),
        onError: (error) => showError(error, "content.toast.typeFailed"),
      }
    );
  }

  function handleScheduledDateChange(contentId: string, date: string) {
    updateContentMutation.mutate(
      { contentId, data: { scheduledDate: date } },
      {
        onSuccess: () => toast.success(t("content.toast.dateUpdated")),
        onError: (error) => showError(error, "content.toast.dateFailed"),
      }
    );
  }

  function handlePlatformsChange(contentId: string, platforms: Platform[]) {
    updateContentMutation.mutate(
      { contentId, data: { platforms } },
      {
        onSuccess: () => toast.success(t("content.toast.platformsUpdated")),
        onError: (error) => showError(error, "content.toast.platformsFailed"),
      }
    );
  }

  function handleCreateContent(
    newContent: Parameters<typeof createContentMutation.mutate>[0]
  ) {
    createContentMutation.mutate(newContent, {
      onSuccess: () => {
        toast.success(t("content.toast.created"));
      },
      onError: (error) => {
        showError(error, "content.toast.createFailed");
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
          toast.success(t("content.toast.bulkStatusUpdated"));
        },
        onError: (error) => {
          showError(error, "content.toast.bulkStatusFailed");
        },
      }
    );
  }

  function handleAssignChange(contentId: string, assignedToId: string) {
    assignMutation.mutate(
      { contentId, assignedToId },
      {
        onSuccess: () => toast.success(t("content.toast.assigneeUpdated")),
        onError: (error) => showError(error, "content.toast.assigneeFailed"),
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
          toast.success(t("content.toast.bulkAssigned"));
        },
        onError: (error) => {
          showError(error, "content.toast.bulkAssignFailed");
        },
      }
    );
  }

  function handleReorder(contentId: string, newOrder: number) {
    updateContentMutation.mutate(
      { contentId, data: { order: newOrder } },
      {
        onError: (error) => showError(error, "content.toast.orderFailed"),
      }
    );
  }

  function handleOpenDetails(item: BackendContentItem) {
    setDetailItem(item);
    setIsDetailOpen(true);
  }

  function handleBulkDelete(contentIds: string[]) {
    setPendingDeleteIds(contentIds);
  }

  function confirmDelete() {
    if (!pendingDeleteIds) return;
    bulkDeleteMutation.mutate(
      { contentIds: pendingDeleteIds },
      {
        onSuccess: () => {
          toast.success(t("content.toast.deleted"));
        },
        onError: (error) => {
          showError(error, "content.toast.deleteFailed");
        },
        onSettled: () => {
          setPendingDeleteIds(null);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("content.title")}</h1>

          <p className="text-muted-foreground">
            {t("content.description")}
          </p>
        </div>

        <AddContentDialog onCreateContent={handleCreateContent} />
      </div>

      <ContentFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            {t("content.loading")}
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent role="alert" className="text-sm text-destructive">
            {t("content.error")}
          </CardContent>
        </Card>
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
          onReorder={handleReorder}
        />
      )}

      <ContentDetailSheet
        key={detailItem?.id ?? "empty"}
        item={detailItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <AlertDialog
        open={pendingDeleteIds !== null}
        onOpenChange={(open) => { if (!open) setPendingDeleteIds(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("content.confirmDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("content.confirmDelete.description", { count: pendingDeleteIds?.length ?? 0 })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}