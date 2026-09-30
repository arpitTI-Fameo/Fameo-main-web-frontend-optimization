// Merge this into your existing app/layout.tsx. Preserve metadata and other providers.
import type { ReactNode } from "react";
import "./globals.css";
import { FameoThemeProvider } from "@/components/fameo-theme-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <FameoThemeProvider>{children}</FameoThemeProvider>
      </body>
    </html>
  );
}
