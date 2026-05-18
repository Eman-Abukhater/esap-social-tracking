"use client";

import { useEffect, useState } from "react";
import { AddContentDialog } from "@/components/content/add-content-dialog";
import { ContentTable } from "@/components/tables/content-table";

import { contentItems as initialContentItems } from "@/lib/mock-data";

import type { ContentItem } from "@/lib/types";

export default function ContentPage() {
    const [contentItems, setContentItems] =
        useState<ContentItem[]>(initialContentItems);

    useEffect(() => {
        const savedContentItems = localStorage.getItem("esap-content-items");

        if (savedContentItems) {
            setContentItems(JSON.parse(savedContentItems));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(
            "esap-content-items",
            JSON.stringify(contentItems)
        );
    }, [contentItems]);
    function handleStatusChange(
        contentId: string,
        newStatus: ContentItem["status"]
    ) {
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
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Content
                    </h1>

                    <p className="text-muted-foreground">
                        Manage and track all social media content.
                    </p>
                </div>

                <AddContentDialog
                    onCreateContent={(newContent) => {
                        setContentItems((previous) => [
                            newContent,
                            ...previous,
                        ]);
                    }}
                />
            </div>

            <ContentTable
                contentItems={contentItems}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}