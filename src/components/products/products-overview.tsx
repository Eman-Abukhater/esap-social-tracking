import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/types";

type ProductsOverviewProps = {
  contentItems: ContentItem[];
};

export function ProductsOverview({ contentItems }: ProductsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const productContent = contentItems.filter(
          (item) => item.productId === product.id
        );

        const publishedCount = productContent.filter(
          (item) => item.status === "published"
        ).length;

        const completionRate =
          productContent.length === 0
            ? 0
            : Math.round((publishedCount / productContent.length) * 100);

        return (
          <div
            key={product.id}
            className="rounded-xl border bg-background p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: product.color }}
                  />

                  <h2 className="font-semibold">{product.name}</h2>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <Badge variant="outline">{completionRate}%</Badge>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{productContent.length}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Published</p>
                <p className="text-xl font-bold">{publishedCount}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Completion</p>
                <p className="text-xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}