"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { BackendContentItem, ContentItem, User } from "@/lib/types";

type ContentTableProps = {
  contentItems: BackendContentItem[];
  users: User[];
  onStatusChange: (contentId: string, status: ContentItem["status"]) => void;
  onBulkStatusChange: (
    contentIds: string[],
    status: ContentItem["status"]
  ) => void;
  onBulkAssign: (contentIds: string[], assignedToId: string) => void;
  onBulkDelete: (contentIds: string[]) => void;
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    planned: "Planned",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
    published: "Published",
  };

  return labels[status] ?? status;
}

function getPriorityVariant(priority: string) {
  if (priority === "high") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

export function ContentTable({
  contentItems,
  users,
  onStatusChange,
  onBulkStatusChange,
  onBulkAssign,
  onBulkDelete,
}: ContentTableProps) {
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, ContentItem["status"]>
  >({});

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(contentItems.length / rowsPerPage));

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return contentItems.slice(startIndex, startIndex + rowsPerPage);
  }, [contentItems, page, rowsPerPage]);

  const allSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item.id));

  function toggleSelectAll() {
    const pageIds = paginatedItems.map((item) => item.id);

    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter((id) => !pageIds.includes(id))
      );
      return;
    }

    setSelectedIds((previous) => Array.from(new Set([...previous, ...pageIds])));
  }

  function toggleSelectOne(contentId: string) {
    setSelectedIds((previous) =>
      previous.includes(contentId)
        ? previous.filter((id) => id !== contentId)
        : [...previous, contentId]
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  if (contentItems.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
        <h3 className="font-semibold">No content found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first content item to start tracking execution.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">{selectedIds.length} selected</p>

            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={clearSelection}
            >
              Clear selection
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              onValueChange={(value) => {
                onBulkStatusChange(
                  selectedIds,
                  value as ContentItem["status"]
                );
                clearSelection();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulk Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                onBulkAssign(selectedIds, value);
                clearSelection();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign User" />
              </SelectTrigger>

              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="destructive"
              onClick={() => {
                onBulkDelete(selectedIds);
                clearSelection();
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </th>

              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Platforms
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Scheduled
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                Last Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.map((item) => {
              const currentStatus = localStatuses[item.id] ?? item.status;
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className="border-b transition hover:bg-muted/40"
                >
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelectOne(item.id)}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: item.product?.color ?? "#94a3b8",
                        }}
                      />
                      <span className="text-sm">
                        {item.product?.name ?? "Unknown Product"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.platforms.map((platform) => (
                        <Badge key={platform} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Select
                      value={currentStatus}
                      onValueChange={(value) => {
                        const newStatus = value as ContentItem["status"];

                        setLocalStatuses((previous) => ({
                          ...previous,
                          [item.id]: newStatus,
                        }));

                        onStatusChange(item.id, newStatus);
                      }}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue>{getStatusLabel(currentStatus)}</SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    {item.assignedTo?.name ?? "Unassigned"}
                  </td>

                  <td className="px-4 py-4">
                    <Badge variant={getPriorityVariant(item.priority)}>
                      {item.priority}
                    </Badge>
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {formatDate(item.scheduledDate)}
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {formatDate(item.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * rowsPerPage + 1}-
          {Math.min(page * rowsPerPage, contentItems.length)} of{" "}
          {contentItems.length}
        </p>

        <div className="flex items-center gap-3">
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setPage(1);
              clearSelection();
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => {
              setPage((previous) => Math.max(1, previous - 1));
              clearSelection();
            }}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => {
              setPage((previous) => Math.min(totalPages, previous + 1));
              clearSelection();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}