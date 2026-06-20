"use client";

import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical, PanelRight, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { useCurrentUser } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { BackendContentItem, ContentItem, Platform, User } from "@/lib/types";
import { PLATFORMS } from "@/lib/constants";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function computeNewOrder(items: BackendContentItem[], fromIndex: number, toIndex: number): number {
  // arrayMove places the dragged item at toIndex in the new array
  const reordered = arrayMove(items, fromIndex, toIndex);
  const before = reordered[toIndex - 1];
  const after = reordered[toIndex + 1];
  if (!before && !after) return 0;
  if (!before) return after.order - 1000;
  if (!after) return before.order + 1000;
  return (before.order + after.order) / 2;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RowHandlers = {
  users: User[];
  canManageContent: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, status: ContentItem["status"]) => void;
  onTitleChange: (id: string, title: string) => void;
  onTypeChange: (id: string, type: ContentItem["type"]) => void;
  onPriorityChange: (id: string, priority: ContentItem["priority"]) => void;
  onScheduledDateChange: (id: string, date: string) => void;
  onPlatformsChange: (id: string, platforms: Platform[]) => void;
  onAssignChange: (id: string, assignedToId: string) => void;
  onOpenDetails: (item: BackendContentItem) => void;
  onDelete: (id: string) => void;
};

// ── SortableRow ───────────────────────────────────────────────────────────────

function SortableRow({ item, ...h }: { item: BackendContentItem } & RowHandlers) {
  const t = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(item.title);

  const isSelected = h.selectedIds.includes(item.id);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? ("relative" as const) : undefined,
  };

  function saveTitleEdit() {
    const next = titleDraft.trim();
    if (next && next !== item.title) h.onTitleChange(item.id, next);
    setEditingTitle(false);
  }

  const currentAssignee = h.users.find((u) => u.id === (item.assignedTo?.id ?? ""));

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b transition hover:bg-muted/40 ${isDragging ? "bg-muted/60 shadow-lg" : ""}`}
      {...attributes}
    >
      {/* Drag handle */}
      <td className="w-10 px-3 py-4">
        <button
          {...listeners}
          type="button"
          className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
          aria-label={t("content.dragToReorder")}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>

      {/* Checkbox */}
      <td className="px-4 py-4">
        <Checkbox checked={isSelected} onCheckedChange={() => h.onToggleSelect(item.id)} />
      </td>

      {/* Title + Type */}
      <td className="px-4 py-4">
        {editingTitle ? (
          <div className="space-y-2">
            <Input
              value={titleDraft}
              autoFocus
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitleEdit();
                if (e.key === "Escape") { setTitleDraft(item.title); setEditingTitle(false); }
              }}
              onBlur={saveTitleEdit}
            />
            <p className="text-xs text-muted-foreground">{t("content.editTitleSaveHint")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div
              className="cursor-text rounded-md px-1 py-1 hover:bg-muted"
              onDoubleClick={() => { setTitleDraft(item.title); setEditingTitle(true); }}
              title={t("content.editTitleHint")}
            >
              <p className="font-medium">{item.title}</p>
            </div>
            <Select
              value={item.type}
              onValueChange={(v) => {
                h.onTypeChange(item.id, v as ContentItem["type"]);
              }}
            >
              <SelectTrigger className="h-6 w-[110px] border-0 px-1 text-xs text-muted-foreground shadow-none hover:bg-muted focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">{t("type.post")}</SelectItem>
                <SelectItem value="video">{t("type.video")}</SelectItem>
                <SelectItem value="reel">{t("type.reel")}</SelectItem>
                <SelectItem value="carousel">{t("type.carousel")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </td>

      {/* Product */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.product?.color ?? "#94a3b8" }} />
          <span className="text-sm">{item.product?.name ?? "—"}</span>
        </div>
      </td>

      {/* Platforms */}
      <td className="px-4 py-4">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="flex flex-wrap gap-1 rounded-md px-1 py-1 hover:bg-muted">
              {item.platforms.length === 0 ? (
                <span className="text-xs text-muted-foreground">{t("content.none")}</span>
              ) : (
                item.platforms.map((p) => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <div className="space-y-1">
              {PLATFORMS.map((platform) => (
                <label key={platform} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
                  <Checkbox
                    checked={item.platforms.includes(platform)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...item.platforms, platform]
                        : item.platforms.filter((p) => p !== platform);
                      h.onPlatformsChange(item.id, next);
                    }}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <Select
          value={item.status}
          onValueChange={(v) => {
            h.onStatusChange(item.id, v as ContentItem["status"]);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue>{t(`status.${item.status}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">{t("status.planned")}</SelectItem>
            <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
            <SelectItem value="review">{t("status.review")}</SelectItem>
            <SelectItem value="done">{t("status.done")}</SelectItem>
            <SelectItem value="published">{t("status.published")}</SelectItem>
          </SelectContent>
        </Select>
      </td>

      {/* Assigned To */}
      <td className="px-4 py-4">
        {h.canManageContent ? (
          <Select
            value={item.assignedTo?.id ?? ""}
            onValueChange={(v) => {
              h.onAssignChange(item.id, v);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2 overflow-hidden">
                {currentAssignee ? (
                  <>
                    <UserAvatar user={currentAssignee} size="sm" />
                    <span className="truncate text-sm">{currentAssignee.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">{t("content.unassigned")}</span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              {h.users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  <div className="flex items-center gap-2">
                    <UserAvatar user={u} size="sm" />
                    {u.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2">
            {item.assignedTo && <UserAvatar user={item.assignedTo} size="sm" />}
            <span className="text-sm">{item.assignedTo?.name ?? t("content.unassigned")}</span>
          </div>
        )}
      </td>

      {/* Priority */}
      <td className="px-4 py-4">
        <Select
          value={item.priority}
          onValueChange={(v) => {
            h.onPriorityChange(item.id, v as ContentItem["priority"]);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>{t(`priority.${item.priority}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t("priority.low")}</SelectItem>
            <SelectItem value="medium">{t("priority.medium")}</SelectItem>
            <SelectItem value="high">{t("priority.high")}</SelectItem>
          </SelectContent>
        </Select>
      </td>

      {/* Scheduled Date */}
      <td className="px-4 py-4">
        <input
          type="date"
          className="rounded-md border-0 bg-transparent px-1 py-1 text-sm text-muted-foreground hover:bg-muted focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          value={item.scheduledDate ? item.scheduledDate.slice(0, 10) : ""}
          onChange={(e) => { if (e.target.value) h.onScheduledDateChange(item.id, e.target.value); }}
        />
      </td>

      {/* Last Updated */}
      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(item.updatedAt)}</td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t("common.viewDetails")}
            className="text-muted-foreground hover:text-foreground"
            onClick={() => h.onOpenDetails(item)}
          >
            <PanelRight className="h-4 w-4" />
          </button>
          {h.canManageContent && (
            <button
              type="button"
              aria-label={t("common.delete")}
              className="text-muted-foreground hover:text-destructive"
              onClick={() => h.onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── ContentTable ──────────────────────────────────────────────────────────────

type ContentTableProps = {
  contentItems: BackendContentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  users: User[];
  onStatusChange: (contentId: string, status: ContentItem["status"]) => void;
  onTitleChange: (contentId: string, title: string) => void;
  onTypeChange: (contentId: string, type: ContentItem["type"]) => void;
  onPriorityChange: (contentId: string, priority: ContentItem["priority"]) => void;
  onScheduledDateChange: (contentId: string, date: string) => void;
  onPlatformsChange: (contentId: string, platforms: Platform[]) => void;
  onBulkStatusChange: (contentIds: string[], status: ContentItem["status"]) => void;
  onAssignChange: (contentId: string, assignedToId: string) => void;
  onBulkAssign: (contentIds: string[], assignedToId: string) => void;
  onBulkDelete: (contentIds: string[]) => void;
  onOpenDetails: (item: BackendContentItem) => void;
  onReorder: (contentId: string, newOrder: number) => void;
};

export function ContentTable({
  contentItems,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  users,
  onStatusChange,
  onTitleChange,
  onTypeChange,
  onPriorityChange,
  onScheduledDateChange,
  onPlatformsChange,
  onBulkStatusChange,
  onAssignChange,
  onBulkAssign,
  onBulkDelete,
  onOpenDetails,
  onReorder,
}: ContentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const t = useTranslation();

  const currentUser = useCurrentUser();
  const canManageContent = currentUser?.role === "admin" || currentUser?.role === "manager";

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handlePageChange(newPage: number) {
    setSelectedIds([]);
    onPageChange(newPage);
  }

  function handlePageSizeChange(newSize: number) {
    setSelectedIds([]);
    onPageSizeChange(newSize);
  }

  const allSelected =
    contentItems.length > 0 && contentItems.every((item) => selectedIds.includes(item.id));

  function toggleSelectAll() {
    const pageIds = contentItems.map((item) => item.id);
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = contentItems.findIndex((i) => i.id === active.id);
    const toIndex = contentItems.findIndex((i) => i.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = computeNewOrder(contentItems, fromIndex, toIndex);
    onReorder(active.id as string, newOrder);
  }

  if (contentItems.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
        <h3 className="font-semibold">{t("content.noContent")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("content.noContentDesc")}
        </p>
      </div>
    );
  }

  const rowHandlers: Omit<RowHandlers, "selectedIds" | "onToggleSelect"> = {
    users,
    canManageContent,
    onStatusChange,
    onTitleChange,
    onTypeChange,
    onPriorityChange,
    onScheduledDateChange,
    onPlatformsChange,
    onAssignChange,
    onOpenDetails,
    onDelete: (id: string) => onBulkDelete([id]),
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">{t("content.selected", { count: selectedIds.length })}</p>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedIds([])}
            >
              {t("content.clearSelection")}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              onValueChange={(v) => {
                onBulkStatusChange(selectedIds, v as ContentItem["status"]);
                setSelectedIds([]);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("content.bulkStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">{t("status.planned")}</SelectItem>
                <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
                <SelectItem value="review">{t("status.review")}</SelectItem>
                <SelectItem value="done">{t("status.done")}</SelectItem>
                <SelectItem value="published">{t("status.published")}</SelectItem>
              </SelectContent>
            </Select>

            {canManageContent && (
              <Select
                onValueChange={(v) => {
                  onBulkAssign(selectedIds, v);
                  setSelectedIds([]);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("content.assignUser")} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {canManageContent && (
              <Button
                variant="destructive"
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
              >
                {t("content.deleteSelected")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full min-w-[1160px]">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="w-10 px-3 py-3" />
                <th className="w-12 px-4 py-3">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                </th>
                {[
                  t("content.col.title"),
                  t("content.col.product"),
                  t("content.col.platforms"),
                  t("content.col.status"),
                  t("content.col.assignedTo"),
                  t("content.col.priority"),
                  t("content.col.scheduled"),
                  t("content.col.lastUpdated"),
                  "",
                ].map((h, i) => (
                  <th key={h || i} className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <SortableContext items={contentItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {contentItems.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    selectedIds={selectedIds}
                    onToggleSelect={(id) =>
                      setSelectedIds((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      )
                    }
                    {...rowHandlers}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {t("content.showing", {
            from: total === 0 ? 0 : (page - 1) * pageSize + 1,
            to: Math.min(page * pageSize, total),
            total,
          })}
        </p>

        <div className="flex items-center gap-3">
          <Select value={String(pageSize)} onValueChange={(v) => handlePageSizeChange(Number(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">{t("content.perPage", { size: 5 })}</SelectItem>
              <SelectItem value="10">{t("content.perPage", { size: 10 })}</SelectItem>
              <SelectItem value="20">{t("content.perPage", { size: 20 })}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
            {t("content.previous")}
          </Button>

          <span className="text-sm text-muted-foreground">
            {t("content.pageOf", { page, totalPages: Math.max(1, totalPages) })}
          </span>

          <Button variant="outline" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
            {t("content.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
