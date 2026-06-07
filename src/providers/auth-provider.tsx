"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

import { useUsers } from "@/hooks/use-users";
import type { User } from "@/lib/types";

const STORAGE_KEY = "esap-current-user-id";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function setStoredUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(STORAGE_KEY, userId);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  listeners.forEach((listener) => listener());
}

type AuthContextValue = {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  selectUser: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: users = [], isLoading: isUsersLoading } = useUsers();

  const currentUserId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const currentUser = users.find((user) => user.id === currentUserId) ?? null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading: isUsersLoading,
        selectUser: (userId) => setStoredUserId(userId),
        logout: () => setStoredUserId(null),
      }}
    >
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
