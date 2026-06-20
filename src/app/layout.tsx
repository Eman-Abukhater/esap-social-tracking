import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { AuthGate } from "@/components/auth/auth-gate";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "ESAP Social Tracking",
  description: "Internal social media execution tracking platform",
};

const initScript = `
  try {
    var t = localStorage.getItem('esap-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
    var l = localStorage.getItem('esap-language') || 'ar';
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            <LanguageProvider>
              <AuthProvider>
                <AuthGate>
                  <Sidebar />

                  <main className="min-h-screen bg-muted/30 p-4 pt-16 md:p-6 md:ms-64">
                    {children}
                  </main>

                  <Toaster richColors position="top-right" />
                </AuthGate>
              </AuthProvider>
            </LanguageProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
