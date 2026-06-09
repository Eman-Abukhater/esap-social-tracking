"use client";

import { TeamList } from "@/components/team/team-list";
import { TeamWorkload } from "@/components/team/team-workload";
import { useContentItems } from "@/hooks/use-content-items";
import { useUsers } from "@/hooks/use-users";

const ALL_FILTERS = {
  search: "",
  productId: "all",
  status: "all",
  platform: "all",
  assignedToId: "all",
  startDate: "",
  endDate: "",
} as const;

export default function TeamPage() {
  const { data: users = [], isLoading: isUsersLoading, isError: isUsersError } = useUsers();
  const { data: contentItems = [], isLoading: isItemsLoading } = useContentItems(ALL_FILTERS);

  const isLoading = isUsersLoading || isItemsLoading;
  const isError = isUsersError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          View team members, roles, and assignment workload.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading team...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load team members.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <TeamList users={users} />
          <TeamWorkload users={users} contentItems={contentItems} />
        </>
      )}
    </div>
  );
}
