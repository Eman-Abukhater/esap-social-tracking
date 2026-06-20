"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Languages,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Sun,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage, useTranslation } from "@/providers/language-provider";
import { useTheme } from "@/providers/theme-provider";

const navigationKeys = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.content", href: "/content", icon: FileText },
  { key: "nav.products", href: "/products", icon: Package },
  { key: "nav.activity", href: "/activity", icon: Activity },
  { key: "nav.team", href: "/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const t = useTranslation();

  return (
    <aside className="fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e bg-background px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{t("app.name")}</h1>
          <p className="text-sm text-muted-foreground">{t("app.subtitle")}</p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={t("nav.toggleLanguage")}
            className="text-muted-foreground"
          >
            <Languages className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={t("nav.toggleTheme")}
            className="text-muted-foreground"
          >
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navigationKeys.map((item) => {
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
              {t(item.key)}
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            title={t("nav.logout")}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}
