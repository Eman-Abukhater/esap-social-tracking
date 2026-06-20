"use client";

import { useTranslation } from "@/providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
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
  const t = useTranslation();
  const { data: users = [], isLoading: isUsersLoading, isError: isUsersError } = useUsers();
  const { data: contentItems = [], isLoading: isItemsLoading } = useContentItems(ALL_FILTERS);

  const isLoading = isUsersLoading || isItemsLoading;
  const isError = isUsersError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("team.title")}</h1>
        <p className="text-muted-foreground">
          {t("team.description")}
        </p>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            {t("team.loading")}
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent role="alert" className="text-sm text-destructive">
            {t("team.error")}
          </CardContent>
        </Card>
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
