"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const t = useTranslation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("auth.loading")}</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
