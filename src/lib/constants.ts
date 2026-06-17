import type { BackendActivityLog, ContentStatus, ContentType, Platform, Priority } from "@/lib/types";

export const PLATFORMS: Platform[] = [
  "LinkedIn", "X", "Instagram", "TikTok", "YouTube", "Facebook",
];

export const STATUSES: ContentStatus[] = [
  "planned", "in_progress", "review", "done", "published",
];

export const STATUS_LABELS: Record<ContentStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  published: "Published",
};

export const TYPE_LABELS: Record<ContentType, string> = {
  post: "Post",
  video: "Video",
  reel: "Reel",
  carousel: "Carousel",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function getChangedFields(
  log: BackendActivityLog
): { field: string; from: unknown; to: unknown }[] {
  if (!log.previousValue || !log.newValue || typeof log.newValue !== "object") return [];
  const prev = log.previousValue as Record<string, unknown>;
  const next = log.newValue as Record<string, unknown>;
  return Object.keys(next).map((k) => ({ field: k, from: prev[k], to: next[k] }));
}
