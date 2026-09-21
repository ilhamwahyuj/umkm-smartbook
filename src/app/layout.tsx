// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/react-query/QueryProvider";

export const metadata: Metadata = {
  title: "UMKM SmartBook",
  description: "Sistem manajemen keuangan dan operasional UMKM yang sederhana namun powerful",
  keywords: ["UMKM", "kasir", "manajemen keuangan", "stok", "penjualan"],
  authors: [{ name: "UMKM SmartBook" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
