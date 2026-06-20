"use client";

import { createContext, useCallback, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextValue = {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: currentUser = null, isLoading } = useQuery<User | null>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      try {
        return await apiFetch<User>("/auth/me");
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiFetch<User>("/auth/login", {
        method: "POST",
        body: { email, password },
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-me"], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () =>
      apiFetch<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(["auth-me"], null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    [loginMutation]
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation]
  );

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function useCurrentUser() {
  return useAuth().currentUser;
}
