"use client";

import { TeamList } from "@/components/team/team-list";
import { useUsers } from "@/hooks/use-users";

export default function TeamPage() {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          View team members and their roles.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          Loading team members...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border bg-background p-6 text-sm text-red-500">
          Failed to load team members.
        </div>
      )}

      {!isLoading && !isError && <TeamList users={users} />}
    </div>
  );
}