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
export type BackendContentItem = Omit<
  ContentItem,
  "assignedTo" | "createdBy"
> & {
  product: Product;
  assignedTo: User;
  createdBy: User;
};
export type PaginatedContentItems = {
  items: BackendContentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BackendActivityLog = Omit<
  ActivityLog,
  "changedBy"
> & {
  changedBy: User;
  contentItem?: ContentItem | null;
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

export type DashboardStats = {
  totals: {
    totalContent: number;
    published: number;
    inProgress: number;
    planned: number;
  };
  completionRate: number;
  statusBreakdown: { status: ContentStatus; total: number }[];
  typeBreakdown: { type: ContentType; total: number }[];
  postsPerProduct: { productId: string; productName: string; total: number }[];
  productCompletion: {
    productId: string;
    productName: string;
    total: number;
    published: number;
    completionRate: number;
  }[];
  platformDistribution: { platform: Platform; total: number }[];
  weeklyOutput: { date: string; total: number }[];
};