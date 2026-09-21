// src/app/(app)/layout.tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    template: "%s | UMKM SmartBook",
    default: "UMKM SmartBook",
  },
  description: "Sistem manajemen keuangan dan operasional UMKM",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
