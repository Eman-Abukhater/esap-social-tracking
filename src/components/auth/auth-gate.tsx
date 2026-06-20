"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/providers/auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
