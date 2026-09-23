"use client";
// src/components/layout/Sidebar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";
import type { UserRole } from "@/types/database";

type NavItem = {
  href: string;
  label: string;
  icon: string; // Material Symbols Outlined icon name
  roles: UserRole[];
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const navItems: NavGroup[] = [
  {
    group: "Menu Utama",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "space_dashboard", roles: ["owner", "admin", "viewer"] },
      { href: "/kasir", label: "Kasir POS", icon: "point_of_sale", roles: ["owner", "admin", "cashier"] },
      { href: "/transaksi/penjualan", label: "Transaksi Penjualan", icon: "receipt_long", roles: ["owner", "admin", "cashier"] },
      { href: "/transaksi/pembelian", label: "Pembelian Stok", icon: "local_mall", roles: ["owner", "admin"] },
      { href: "/laporan", label: "Laporan & Buku Kas", icon: "account_balance_wallet", roles: ["owner", "accounting", "viewer"] },
    ],
  },
  {
    group: "Finansial & Gudang",
    items: [
      { href: "/keuangan/piutang-dan-hutang", label: "Piutang & Hutang", icon: "price_check", roles: ["owner", "accounting"] },
      { href: "/keuangan/operasional", label: "Biaya Operasional", icon: "payments", roles: ["owner", "accounting"] },
      { href: "/inventory", label: "Stok & Opname", icon: "inventory_2", roles: ["owner", "admin", "warehouse"] },
    ],
  },
  {
    group: "Pengaturan & Akun",
    items: [
      { href: "/pengaturan", label: "Pengaturan Toko", icon: "settings", roles: ["owner"] },
      { href: "/pengaturan/keamanan", label: "Keamanan", icon: "shield_person", roles: ["owner"] },
      { href: "/bantuan", label: "Pusat Bantuan CS", icon: "support_agent", roles: ["owner", "admin", "cashier"] },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentOrg, currentMember, hasRole, setDemoRole, clearOrg } = useOrgStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "demo_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cashier_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearOrg();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/pengaturan") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-60 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 p-4 fixed top-16 bottom-0 left-0 z-40 overflow-y-auto transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="space-y-6">
          {isMounted && navItems.map((group) => {
            const filteredItems = group.items.filter(item => hasRole(item.roles));
            
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.group}>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {group.group}
                </p>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all text-sm",
                          active 
                            ? "bg-teal-50 text-teal-700 font-bold" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <span className={cn(
                          "material-symbols-outlined text-[18px]",
                          active ? "" : "text-slate-400"
                        )}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM: Current User Context / Shift */}
        {isMounted && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                {currentMember?.user_id?.substring(0, 2).toUpperCase() || 'DA'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {currentMember?.role === 'owner' ? 'Owner / Admin' : 'Dewi Astuti'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  {currentOrg?.name || 'toko.berkah@smartbook.id'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center shrink-0 ml-2 md:hidden"
              title="Keluar"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
