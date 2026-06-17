"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Sun,
  Users,
} from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Content", href: "/content", icon: FileText },
  { title: "Products", href: "/products", icon: Package },
  { title: "Activity", href: "/activity", icon: Activity },
  { title: "Team", href: "/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-background px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">ESAP</h1>
          <p className="text-sm text-muted-foreground">Social Tracking</p>
        </div>

        {/* Sun shown in dark mode (click → switch to light); Moon shown in light mode (click → switch to dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          title="Toggle theme"
          className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Sun className="h-4 w-4 hidden dark:block" />
          <Moon className="h-4 w-4 dark:hidden" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {currentUser && (
        <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentUser.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">
              {currentUser.role}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Switch user"
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
