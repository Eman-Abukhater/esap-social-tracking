import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";

type TeamListProps = {
  users: User[];
};

export function TeamList({ users }: TeamListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-xl border bg-background p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}