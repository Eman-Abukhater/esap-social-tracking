"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { WeeklyOutputChart } from "@/components/dashboard/weekly-output-chart";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useTranslation } from "@/providers/language-provider";

import type {
  BackendContentItem,
  ContentStatus,
  ContentType,
  Product,
} from "@/lib/types";

type ProductDetailsProps = {
  product: Product;
  contentItems: BackendContentItem[];
};

export function ProductDetails({
  product,
  contentItems,
}: ProductDetailsProps) {
  const t = useTranslation();
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats(
    product.id
  );

  const statusLabels: Record<ContentStatus, string> = {
    planned: t("status.planned"),
    in_progress: t("status.in_progress"),
    review: t("status.review"),
    done: t("status.done"),
    published: t("status.published"),
  };

  const typeLabels: Record<ContentType, string> = {
    post: t("products.posts"),
    video: t("products.videos"),
    reel: t("products.reels"),
    carousel: t("products.carousels"),
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: product.color }}
            />
            <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          </div>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
      </Card>

      {isStatsLoading && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            {t("products.loadingPerformance")}
          </CardContent>
        </Card>
      )}

      {stats && (
        <>
          <div className="grid gap-4 xl:grid-cols-5">
            {stats.statusBreakdown.map((entry) => (
              <StatCard
                key={entry.status}
                title={statusLabels[entry.status]}
                value={entry.total}
              />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-5">
            {stats.typeBreakdown.map((entry) => (
              <StatCard
                key={entry.type}
                title={typeLabels[entry.type]}
                value={entry.total}
              />
            ))}

            <StatCard
              title={t("products.completionRate")}
              value={`${stats.completionRate}%`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PlatformDistributionChart data={stats.platformDistribution} />
            <WeeklyOutputChart data={stats.weeklyOutput} />
          </div>
        </>
      )}

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{t("products.productContent")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("content.col.title")}</TableHead>
                <TableHead>{t("content.col.status")}</TableHead>
                <TableHead>{t("content.col.assignedTo")}</TableHead>
                <TableHead>{t("content.col.priority")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.assignedTo?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.priority}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
