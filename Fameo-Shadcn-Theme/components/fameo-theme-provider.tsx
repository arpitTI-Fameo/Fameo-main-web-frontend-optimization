"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** One root provider. Fameo's approved theme is intentionally light-only. */
export function FameoThemeProvider({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce?: string;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme
      disableTransitionOnChange
      storageKey="fameo-theme"
      nonce={nonce}
    >
      {children}
    </NextThemesProvider>
  );
}
