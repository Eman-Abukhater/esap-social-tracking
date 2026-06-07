import { Badge } from "@/components/ui/badge";

import type {
  BackendContentItem,
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
  const productContent = contentItems.filter(
    (item) => item.productId === product.id
  );

  const plannedCount = productContent.filter(
    (item) => item.status === "planned"
  ).length;

  const progressCount = productContent.filter(
    (item) => item.status === "in_progress"
  ).length;

  const reviewCount = productContent.filter(
    (item) => item.status === "review"
  ).length;

  const doneCount = productContent.filter(
    (item) => item.status === "done"
  ).length;

  const publishedCount = productContent.filter(
    (item) => item.status === "published"
  ).length;

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

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Planned"
          value={plannedCount}
        />

        <StatCard
          title="In Progress"
          value={progressCount}
        />

        <StatCard
          title="Review"
          value={reviewCount}
        />

        <StatCard
          title="Done"
          value={doneCount}
        />

        <StatCard
          title="Published"
          value={publishedCount}
        />
      </div>

      <div className="rounded-xl border bg-background">
        <div className="border-b p-4">
          <h2 className="font-semibold">
            Product Content
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">
                  Title
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Assigned To
                </th>

                <th className="px-4 py-3 text-left">
                  Priority
                </th>
              </tr>
            </thead>

            <tbody>
              {productContent.map((item) => (
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
  value: number;
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