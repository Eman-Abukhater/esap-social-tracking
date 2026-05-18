"use client";

import { contentItems, products, users } from "@/lib/mock-data";

export function ContentTable() {
  return (
    <div className="rounded-xl border bg-background">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Title
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Product
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Assigned To
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Priority
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
                  {product?.name}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  {assignedUser?.name}
                </td>

                <td className="px-4 py-4">
                  {item.priority}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}