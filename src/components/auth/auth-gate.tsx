"use client";

import { UserPicker } from "@/components/auth/user-picker";
import { useAuth } from "@/providers/auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <UserPicker />;
  }

  return <>{children}</>;
}
