"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Link2, Tag, FileText, StickyNote, User } from "lucide-react";

import { useTranslation } from "@/providers/language-provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";

import { useActivityLogs } from "@/hooks/use-activity-logs";
import { useUpdateContentItem } from "@/hooks/use-update-content-item";

import type { BackendActivityLog, BackendContentItem } from "@/lib/types";
import { TYPE_LABELS, getChangedFields } from "@/lib/constants";

type Props = {
  item: BackendContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ── Color maps ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  planned:     { dot: "bg-[var(--status-planned)]",     badge: "border-[var(--status-badge-planned-border)] bg-[var(--status-badge-planned-bg)] text-[var(--status-badge-planned-fg)]" },
  in_progress: { dot: "bg-[var(--status-in-progress)]", badge: "border-[var(--status-badge-in-progress-border)] bg-[var(--status-badge-in-progress-bg)] text-[var(--status-badge-in-progress-fg)]" },
  review:      { dot: "bg-[var(--status-review)]",      badge: "border-[var(--status-badge-review-border)] bg-[var(--status-badge-review-bg)] text-[var(--status-badge-review-fg)]" },
  done:        { dot: "bg-[var(--status-done)]",        badge: "border-[var(--status-badge-done-border)] bg-[var(--status-badge-done-bg)] text-[var(--status-badge-done-fg)]" },
  published:   { dot: "bg-[var(--status-published)]",   badge: "border-[var(--status-badge-published-border)] bg-[var(--status-badge-published-bg)] text-[var(--status-badge-published-fg)]" },
};

const PRIORITY_STYLES: Record<string, { badge: string }> = {
  low:    { badge: "border-[var(--priority-badge-low-border)] bg-[var(--priority-badge-low-bg)] text-[var(--priority-badge-low-fg)]" },
  medium: { badge: "border-[var(--priority-badge-medium-border)] bg-[var(--priority-badge-medium-bg)] text-[var(--priority-badge-medium-fg)]" },
  high:   { badge: "border-[var(--priority-badge-high-border)] bg-[var(--priority-badge-high-bg)] text-[var(--priority-badge-high-fg)]" },
};

const ACTION_KEYS: Record<string, string> = {
  created: "content.action.created",
  updated: "content.action.updated",
  status_changed: "content.action.statusChanged",
  assigned: "content.action.assigned",
  deleted: "content.action.deleted",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined, notSetLabel: string) {
  if (!iso) return notSetLabel;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(iso: string, t: (key: string, params?: Record<string, string | number>) => string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return t("content.time.justNow");
  if (mins < 60) return t("content.time.minutesAgo", { mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("content.time.hoursAgo", { hours });
  const days = Math.floor(hours / 24);
  return t("content.time.daysAgo", { days });
}

function parseTags(input: string): string[] {
  return input.split(",").map((t) => t.trim()).filter(Boolean);
}

// ── Form hook ─────────────────────────────────────────────────────────────────

function useDetailForm(item: BackendContentItem | null) {
  const [description, setDescription] = useState(item?.description ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl ?? "");
  const [tagsInput, setTagsInput] = useState((item?.tags ?? []).join(", "));

  return { description, setDescription, notes, setNotes, mediaUrl, setMediaUrl, tagsInput, setTagsInput };
}

// ── Activity timeline ─────────────────────────────────────────────────────────

function ActivityTimeline({ logs, isLoading }: { logs: BackendActivityLog[]; isLoading: boolean; }) {
  const t = useTranslation();
  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="rounded-full bg-muted p-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">{t("content.noActivity")}</p>
        <p className="text-xs text-muted-foreground">{t("content.noActivityDesc")}</p>
      </div>
    );
  }

  return (
    <div className="relative pt-2">
      <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />

      <div className="space-y-5">
        {logs.map((log) => {
          const status = STATUS_STYLES[log.newValue && typeof log.newValue === "object"
            ? ((log.newValue as Record<string, unknown>).status as string) ?? ""
            : ""] ?? STATUS_STYLES.planned;
          const fields = getChangedFields(log);

          return (
            <div key={log.id} className="relative flex gap-3 pl-1">
              <div className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-background ${
                log.action === "created" ? "bg-[var(--action-created)]" :
                log.action === "deleted" ? "bg-[var(--action-deleted)]" :
                log.action === "status_changed" ? status.dot :
                "bg-[var(--action-default)]"
              }`} />

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm">
                    <span className="font-medium">{log.changedBy?.name ?? "Someone"}</span>
                    {" "}<span className="text-muted-foreground">{ACTION_KEYS[log.action] ? t(ACTION_KEYS[log.action]) : log.action} this</span>
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(log.timestamp, t)}</span>
                </div>

                {fields.length > 0 && log.action !== "deleted" && (
                  <div className="mt-1 space-y-0.5">
                    {fields.slice(0, 3).map((f) => (
                      <p key={f.field} className="text-xs text-muted-foreground">
                        <span className="capitalize">{f.field.replace(/_/g, " ")}</span>:{" "}
                        <span className="line-through opacity-60">{String(f.from ?? "—")}</span>
                        {" → "}
                        <span className="font-medium text-foreground">{String(f.to ?? "—")}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContentDetailSheet({ item, open, onOpenChange }: Props) {
  const t = useTranslation();
  const { description, setDescription, notes, setNotes, mediaUrl, setMediaUrl, tagsInput, setTagsInput } =
    useDetailForm(item);

  const updateMutation = useUpdateContentItem();

  const { data: activityLogs = [], isLoading: isActivityLoading } = useActivityLogs(
    item
      ? { userId: "all", productId: "all", contentId: item.id }
      : { userId: "all", productId: "all", contentId: "all" }
  );

  function handleSave() {
    if (!item) return;
    updateMutation.mutate(
      {
        contentId: item.id,
        data: {
          description: description || undefined,
          notes: notes || undefined,
          mediaUrl: mediaUrl || undefined,
          tags: parseTags(tagsInput),
        },
      },
      {
        onSuccess: () => toast.success("Details saved"),
        onError: () => toast.error("Failed to save details"),
      }
    );
  }

  const statusStyle = item ? (STATUS_STYLES[item.status] ?? STATUS_STYLES.planned) : STATUS_STYLES.planned;
  const priorityStyle = item ? (PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.medium) : PRIORITY_STYLES.medium;
  const liveTags = parseTags(tagsInput);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]">

        {/* ── Header ── */}
        <div className="relative border-b bg-background px-6 pb-4 pt-6">
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-tl-xl"
            style={{ backgroundColor: item?.product?.color ?? "#94a3b8" }}
          />

          <SheetTitle className="sr-only">{item?.title ?? t("content.contentDetails")}</SheetTitle>

          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-1.5 pl-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item?.product?.color ?? "#94a3b8" }}
            />
            <span className="text-xs font-medium text-muted-foreground">{item?.product?.name ?? ""}</span>
          </div>

          {/* Title */}
          <h2 className="pl-1 text-lg font-semibold leading-snug">{item?.title ?? ""}</h2>

          {/* Badge row */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pl-1">
            <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {item ? TYPE_LABELS[item.type] ?? item.type : ""}
            </span>

            <span className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyle.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {item?.status.replace("_", " ") ?? ""}
            </span>

            <span className={`rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${priorityStyle.badge}`}>
              {item?.priority ?? ""}
            </span>
          </div>

          {/* Assignee + date */}
          <div className="mt-3 flex flex-wrap items-center gap-4 pl-1 text-xs text-muted-foreground">
            {item?.assignedTo ? (
              <span className="flex items-center gap-1.5">
                <UserAvatar user={item.assignedTo} size="sm" />
                <span className="font-medium text-foreground">{item.assignedTo.name}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {t("content.unassigned")}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(item?.scheduledDate, t("content.notSet"))}
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="details" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-6 pt-3">
            <TabsList className="h-8 rounded-none border-0 bg-transparent p-0 gap-4">
              <TabsTrigger
                value="details"
                className="h-8 rounded-none border-b-2 border-transparent px-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {t("content.details")}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="h-8 rounded-none border-b-2 border-transparent px-0 text-sm font-medium text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {t("content.activity")}
                {activityLogs.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums">
                    {activityLogs.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Details tab ── */}
          <TabsContent value="details" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="detail-description" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    {t("content.description_label")}
                  </label>
                  <Textarea
                    id="detail-description"
                    className="resize-none bg-muted/30 leading-relaxed focus:bg-background"
                    rows={4}
                    placeholder={t("content.addDescription")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="detail-notes" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <StickyNote className="h-3.5 w-3.5" />
                    {t("content.internalNotes")}
                  </label>
                  <Textarea
                    id="detail-notes"
                    className="resize-none bg-muted/30 leading-relaxed focus:bg-background"
                    rows={3}
                    placeholder={t("content.internalNotesPlaceholder")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Media URL */}
                <div className="space-y-1.5">
                  <label htmlFor="detail-media-url" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    {t("content.mediaUrl")}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="detail-media-url"
                      type="url"
                      className="min-w-0 flex-1 bg-muted/30 focus:bg-background"
                      placeholder={t("content.mediaUrlPlaceholder")}
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    {mediaUrl && (
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("content.openMediaLink")}
                        className="flex items-center rounded-lg border bg-muted/30 px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label htmlFor="detail-tags" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {t("content.tags")}
                  </label>

                  {liveTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {liveTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Input
                    id="detail-tags"
                    type="text"
                    className="bg-muted/30 focus:bg-background"
                    placeholder={t("content.tagsPlaceholder")}
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* Sticky save footer */}
            <div className="border-t bg-background px-6 py-4">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="w-full"
                size="sm"
              >
                {updateMutation.isPending ? t("content.saving") : t("content.saveChanges")}
              </Button>
            </div>
          </TabsContent>

          {/* ── Activity tab ── */}
          <TabsContent value="activity" className="mt-0 flex-1 overflow-y-auto px-6 py-5">
            <ActivityTimeline logs={activityLogs} isLoading={isActivityLoading} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
