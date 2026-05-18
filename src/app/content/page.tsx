import { AddContentDialog } from "@/components/content/add-content-dialog";
import { ContentTable } from "@/components/tables/content-table";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content</h1>

          <p className="text-muted-foreground">
            Manage and track all social media content.
          </p>
        </div>

        <AddContentDialog />
      </div>

      <ContentTable />
    </div>
  );
}