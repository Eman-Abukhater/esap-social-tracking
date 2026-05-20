"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Content", href: "/content", icon: FileText },
  { title: "Products", href: "/products", icon: Package },
  { title: "Activity", href: "/activity", icon: Activity },
  { title: "Team", href: "/team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background px-4 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ESAP</h1>
        <p className="text-sm text-muted-foreground">Social Tracking</p>
      </div>

      <nav className="space-y-2">
       {navigationItems.map((item) => {
  const Icon = item.icon;

  const isDashboard =
    item.href === "/dashboard" && pathname === "/";

  const isActive =
    pathname === item.href || isDashboard;

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
    </aside>
  );
}