import type { ActivityLog, ContentItem, Product, User } from "./types";

export const products: Product[] = [
  {
    id: "product-1",
    name: "ESAP AI ERP",
    description: "AI-powered ERP system for business operations.",
    color: "#2563eb",
    createdAt: "2026-05-01",
  },
  {
    id: "product-2",
    name: "Agent Builder",
    description: "Platform for building AI agents.",
    color: "#16a34a",
    createdAt: "2026-05-03",
  },
  {
    id: "product-3",
    name: "ESAP Analytics",
    description: "Analytics and reporting product.",
    color: "#9333ea",
    createdAt: "2026-05-05",
  },
];

export const users: User[] = [
  {
    id: "user-1",
    name: "Ahmed",
    email: "ahmed@esap.ai",
    role: "manager",
  },
  {
    id: "user-2",
    name: "Sarah",
    email: "sarah@esap.ai",
    role: "contributor",
  },
  {
    id: "user-3",
    name: "Omar",
    email: "omar@esap.ai",
    role: "admin",
  },
];

export const contentItems: ContentItem[] = [
  {
    id: "content-1",
    title: "ESAP AI ERP Launch Post",
    description: "LinkedIn launch post for the ERP product.",
    type: "post",
    productId: "product-1",
    status: "planned",
    platforms: ["LinkedIn"],
    scheduledDate: "2026-05-22",
    createdBy: "user-1",
    assignedTo: "user-2",
    priority: "high",
    tags: ["launch", "erp"],
    notes: "Needs final copy review.",
    order: 1000,
    createdAt: "2026-05-15",
    updatedAt: "2026-05-15",
  },
  {
    id: "content-2",
    title: "Agent Builder Instagram Reel",
    description: "Short reel explaining how agents are created.",
    type: "reel",
    productId: "product-2",
    status: "in_progress",
    platforms: ["Instagram", "TikTok"],
    scheduledDate: "2026-05-24",
    createdBy: "user-1",
    assignedTo: "user-3",
    priority: "medium",
    tags: ["ai-agent", "reel"],
    notes: "Video editing in progress.",
    order: 2000,
    createdAt: "2026-05-16",
    updatedAt: "2026-05-17",
  },
  {
    id: "content-3",
    title: "Analytics Product Demo Video",
    description: "YouTube demo video for analytics dashboard.",
    type: "video",
    productId: "product-3",
    status: "published",
    platforms: ["YouTube", "LinkedIn"],
    scheduledDate: "2026-05-18",
    publishedDate: "2026-05-18",
    createdBy: "user-3",
    assignedTo: "user-1",
    priority: "high",
    tags: ["demo", "analytics"],
    mediaUrl: "https://example.com/demo-video",
    notes: "Published successfully.",
    order: 3000,
    createdAt: "2026-05-10",
    updatedAt: "2026-05-18",
  },
];

export const activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    entityType: "content",
    entityId: "content-1",
    action: "created",
    newValue: {
      title: "ESAP AI ERP Launch Post",
      status: "planned",
    },
    changedBy: "user-1",
    timestamp: "2026-05-15T10:00:00Z",
  },
  {
    id: "log-2",
    entityType: "content",
    entityId: "content-2",
    action: "status_changed",
    previousValue: {
      status: "planned",
    },
    newValue: {
      status: "in_progress",
    },
    changedBy: "user-3",
    timestamp: "2026-05-17T14:30:00Z",
  },
];