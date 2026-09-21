"use client";
// src/components/layout/AppShell.tsx
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { createClient } from "@/lib/supabase/client";
import { useOrgStore } from "@/stores/useOrgStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCurrentOrg = useOrgStore(state => state.setCurrentOrg);
  const currentOrg = useOrgStore(state => state.currentOrg);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil data member dan relasi organisasi
      const { data: members } = await supabase
        .from("organization_members")
        .select("*, organizations(*)")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (members && members.length > 0) {
        const validOrgIds = members.map((m: any) => m.organizations.id);
        // Jika currentOrg kosong atau tidak valid, set org pertama sebagai default
        if (!currentOrg || !validOrgIds.includes(currentOrg.id)) {
          setCurrentOrg(members[0].organizations, members[0]);
        }
      }
    }
    init();
  }, [currentOrg, setCurrentOrg]);

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen">
      {/* Desktop & Mobile Sidebar */}
      <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />

      <div className="flex pt-16 min-h-screen">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full md:ml-60 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
