"use client";

import { Badge } from "@/components/ui/badge";
import { contentItems, products, users } from "@/lib/mock-data";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    planned: "Planned",
    in_progress: "In Progress",
    review: "Review",
    done: "Done",
    published: "Published",
  };

  return labels[status] ?? status;
}

function getPriorityVariant(priority: string) {
  if (priority === "high") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

export function ContentTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Platforms
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Assigned To
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
              Scheduled
            </th>
          </tr>
        </thead>

        <tbody>
          {contentItems.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId
            );

            const assignedUser = users.find(
              (user) => user.id === item.assignedTo
            );

            return (
              <tr
                key={item.id}
                className="border-b transition hover:bg-muted/40"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: product?.color }}
                    />
                    <span className="text-sm">{product?.name}</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.platforms.map((platform) => (
                      <Badge key={platform} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <Badge variant="secondary">
                    {getStatusLabel(item.status)}
                  </Badge>
                </td>

                <td className="px-4 py-4 text-sm">
                  {assignedUser?.name}
                </td>

                <td className="px-4 py-4">
                  <Badge variant={getPriorityVariant(item.priority)}>
                    {item.priority}
                  </Badge>
                </td>

                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {item.scheduledDate ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}