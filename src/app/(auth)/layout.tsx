// src/app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | UMKM SmartBook",
    default: "Masuk | UMKM SmartBook",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
