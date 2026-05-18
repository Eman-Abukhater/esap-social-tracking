export type Platform =
  | "LinkedIn"
  | "X"
  | "Instagram"
  | "TikTok"
  | "YouTube"
  | "Facebook";

export type ContentType = "post" | "video" | "reel" | "carousel";

export type ContentStatus =
  | "planned"
  | "in_progress"
  | "review"
  | "done"
  | "published";

export type Priority = "low" | "medium" | "high";

export type UserRole = "admin" | "manager" | "contributor";

export type Product = {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  productId: string;
  status: ContentStatus;
  platforms: Platform[];
  scheduledDate?: string;
  publishedDate?: string;
  createdBy: string;
  assignedTo: string;
  priority: Priority;
  tags: string[];
  mediaUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityAction =
  | "created"
  | "updated"
  | "status_changed"
  | "assigned"
  | "deleted";

export type ActivityLog = {
  id: string;
  entityType: "content" | "product";
  entityId: string;
  action: ActivityAction;
  previousValue?: unknown;
  newValue?: unknown;
  changedBy: string;
  timestamp: string;
};