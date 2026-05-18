import { ContentTable } from "@/components/tables/content-table";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Content
        </h1>

        <p className="text-muted-foreground">
          Manage and track all social media content.
        </p>
      </div>

      <ContentTable />
    </div>
  );
}