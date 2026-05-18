import { TeamList } from "@/components/team/team-list";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          View team members and their roles.
        </p>
      </div>

      <TeamList />
    </div>
  );
}