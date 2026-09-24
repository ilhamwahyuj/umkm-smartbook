"use client";
// src/components/layout/MobileNav.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/kasir", label: "Kasir POS", icon: "point_of_sale" },
  { href: "/transaksi/penjualan", label: "Transaksi", icon: "receipt_long" },
  { href: "/inventory", label: "Stok", icon: "inventory_2" },
  { href: "/laporan", label: "Laporan", icon: "grid_view" },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    // if this is the Transaksi tab, ensure it doesn't accidentally light up if we are inside a sub-route that another tab uses.
    // e.g. if we kept /transaksi/penjualan/baru for Kasir, we'd need a specific check.
    // Now that Kasir is /kasir, startsWith is fine, but we can make it exact for /transaksi/penjualan if needed.
    // For safety, let's keep it simple:
    if (href === "/transaksi/penjualan") {
      return pathname.startsWith(href) && !pathname.includes("/baru");
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(15,23,42,0.05)] md:hidden">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-14 transition-colors",
                active
                  ? "text-teal-700 font-bold [&_span.material-symbols-outlined]:[font-variation-settings:'FILL'_1,'wght'_600,'GRAD'_0,'opsz'_24]"
                  : "text-slate-500 font-medium"
              )}
            >
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
              <span className="text-[11px] leading-[14px] tracking-[0.04em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
