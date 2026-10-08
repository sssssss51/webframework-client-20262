"use client";
import { ReactNode } from "react";
import Header from "./Header";
import { useAuthStore } from "@/providers/auth-store-provider";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <></>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
