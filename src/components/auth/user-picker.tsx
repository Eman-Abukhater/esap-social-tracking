"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export function UserPicker() {
  const { users, selectUser } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-background p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Who are you?</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Pick your profile to continue. This identifies you for
            assignments and the activity log.
          </p>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No team members found.</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <label
                key={user.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                  selectedId === user.id
                    ? "border-primary bg-muted"
                    : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="current-user"
                    className="accent-primary"
                    checked={selectedId === user.id}
                    onChange={() => setSelectedId(user.id)}
                  />
                  {user.name}
                </span>

                <span className="text-xs capitalize text-muted-foreground">
                  {user.role}
                </span>
              </label>
            ))}
          </div>
        )}

        <Button
          className="w-full"
          disabled={!selectedId}
          onClick={() => selectedId && selectUser(selectedId)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
