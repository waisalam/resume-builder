"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <SessionProvider>
        <div className="flex min-h-screen flex-col w-full">{children}</div>
      </SessionProvider>
    </ThemeProvider>
  );
}