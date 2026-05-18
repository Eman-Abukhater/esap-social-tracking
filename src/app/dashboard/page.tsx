"use client";

import { useEffect, useState } from "react";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { contentItems as initialContentItems } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/types";

export default function DashboardPage() {
  const [contentItems, setContentItems] =
    useState<ContentItem[]>(initialContentItems);

  useEffect(() => {
    const savedContentItems = localStorage.getItem("esap-content-items");

    if (savedContentItems) {
      setContentItems(JSON.parse(savedContentItems));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Social media execution overview.
        </p>
      </div>

      <DashboardStats contentItems={contentItems} />
    </div>
  );
}