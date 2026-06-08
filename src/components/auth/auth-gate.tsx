"use client";

import { UserPicker } from "@/components/auth/user-picker";
import { useAuth } from "@/providers/auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();

  return (
    <>
      {children}
      {!isLoading && !currentUser && <UserPicker />}
    </>
  );
}
