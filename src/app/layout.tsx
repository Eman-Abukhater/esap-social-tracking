import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { AuthGate } from "@/components/auth/auth-gate";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "ESAP Social Tracking",
  description: "Internal social media execution tracking platform",
};

// Runs synchronously before React hydrates to prevent a flash of unstyled content.
const themeScript = `
  try {
    const t = localStorage.getItem('esap-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <AuthGate>
                <Sidebar />

                <main className="ml-64 min-h-screen bg-muted/30 p-6">
                  {children}
                </main>

                <Toaster richColors position="top-right" />
              </AuthGate>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
