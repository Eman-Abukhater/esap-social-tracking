"use client";

import { useEffect, useState } from "react";

import { AddContentDialog } from "@/components/content/add-content-dialog";
import {
  ContentFilters,
  type ContentFiltersState,
} from "@/components/content/content-filters";
import { ContentTable } from "@/components/tables/content-table";

import {
  activityLogs as initialActivityLogs,
  contentItems as initialContentItems,
} from "@/lib/mock-data";

import type { ActivityLog, ContentItem } from "@/lib/types";

export default function ContentPage() {
  const [contentItems, setContentItems] =
    useState<ContentItem[]>(initialContentItems);

  const [activityLogs, setActivityLogs] =
    useState<ActivityLog[]>(initialActivityLogs);

  const [filters, setFilters] = useState<ContentFiltersState>({
    search: "",
    productId: "all",
    status: "all",
    platform: "all",
  });

  useEffect(() => {
    const savedContentItems = localStorage.getItem("esap-content-items");
    const savedActivityLogs = localStorage.getItem("esap-activity-logs");

    if (savedContentItems) {
      setContentItems(JSON.parse(savedContentItems));
    }

    if (savedActivityLogs) {
      setActivityLogs(JSON.parse(savedActivityLogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("esap-content-items", JSON.stringify(contentItems));
  }, [contentItems]);

  useEffect(() => {
    localStorage.setItem("esap-activity-logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  const filteredContentItems = contentItems.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesProduct =
      filters.productId === "all" || item.productId === filters.productId;

    const matchesStatus =
      filters.status === "all" || item.status === filters.status;

    const matchesPlatform =
      filters.platform === "all" || item.platforms.includes(filters.platform as never);

    return (
      matchesSearch &&
      matchesProduct &&
      matchesStatus &&
      matchesPlatform
    );
  });

  function handleStatusChange(
    contentId: string,
    newStatus: ContentItem["status"]
  ) {
    const currentItem = contentItems.find((item) => item.id === contentId);

    if (!currentItem || currentItem.status === newStatus) return;

    setContentItems((previous) =>
      previous.map((item) =>
        item.id === contentId
          ? {
              ...item,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setActivityLogs((previous) => [
      {
        id: crypto.randomUUID(),
        entityType: "content",
        entityId: contentId,
        action: "status_changed",
        previousValue: { status: currentItem.status },
        newValue: { status: newStatus },
        changedBy: "user-1",
        timestamp: new Date().toISOString(),
      },
      ...previous,
    ]);
  }

  function handleCreateContent(newContent: ContentItem) {
    setContentItems((previous) => [newContent, ...previous]);

    setActivityLogs((previous) => [
      {
        id: crypto.randomUUID(),
        entityType: "content",
        entityId: newContent.id,
        action: "created",
        previousValue: null,
        newValue: {
          title: newContent.title,
          status: newContent.status,
        },
        changedBy: newContent.createdBy,
        timestamp: new Date().toISOString(),
      },
      ...previous,
    ]);
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

      <ContentTable
        contentItems={filteredContentItems}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}