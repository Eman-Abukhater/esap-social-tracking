import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { Sidebar } from "@/components/layout/sidebar";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export const metadata: Metadata = {
  title: "ESAP Social Tracking",
  description: "Internal social media execution tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Sidebar />

          <main className="ml-64 min-h-screen bg-muted/30 p-6">
            {children}
          </main>

          <Toaster richColors position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}