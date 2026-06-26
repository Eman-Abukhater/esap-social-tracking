"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import type { User } from "@/lib/types";
import { useTranslation } from "@/providers/language-provider";

type TeamListProps = {
  users: User[];
};

export function TeamList({ users }: TeamListProps) {
  const t = useTranslation();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="lg" />
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <CardAction>
              <Badge variant="outline">{t(`role.${user.role}`)}</Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}