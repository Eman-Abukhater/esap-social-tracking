"use client";

import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-xl border bg-background p-6">
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 rounded-full"
            style={{
              backgroundColor: product.color,
            }}
          />

          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>
        </div>

        <p className="mt-3 text-muted-foreground">
          {product.description}
        </p>
      </div>

      {isStatsLoading && (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
          {t("products.loadingPerformance")}
        </div>
      )}

      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-5">
            {stats.statusBreakdown.map((entry) => (
              <StatCard
                key={entry.status}
                title={statusLabels[entry.status]}
                value={entry.total}
              />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-5">
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

          <div className="grid gap-4 lg:grid-cols-2">
            <PlatformDistributionChart data={stats.platformDistribution} />
            <WeeklyOutputChart data={stats.weeklyOutput} />
          </div>
        </>
      )}

      <div className="rounded-xl border bg-background">
        <div className="border-b p-4">
          <h2 className="font-semibold">
            {t("products.productContent")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">
                  {t("content.col.title")}
                </th>

                <th className="px-4 py-3 text-left">
                  {t("content.col.status")}
                </th>

                <th className="px-4 py-3 text-left">
                  {t("content.col.assignedTo")}
                </th>

                <th className="px-4 py-3 text-left">
                  {t("content.col.priority")}
                </th>
              </tr>
            </thead>

            <tbody>
              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="px-4 py-3">
                    {item.title}
                  </td>

                  <td className="px-4 py-3">
                    {item.status}
                  </td>

                  <td className="px-4 py-3">
                    {item.assignedTo?.name}
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {item.priority}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
    <div className="rounded-xl border bg-background p-4">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
