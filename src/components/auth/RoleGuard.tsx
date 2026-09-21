"use client";
// src/components/auth/RoleGuard.tsx
import { ReactNode, useState, useEffect } from "react";
import { useOrgStore } from "@/stores/useOrgStore";
import type { UserRole } from "@/types/database";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  showErrorPage?: boolean;
}

export function RoleGuard({ children, allowedRoles, fallback = null, showErrorPage = true }: RoleGuardProps) {
  const { currentMember, hasRole } = useOrgStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // To prevent hydration mismatch, we don't block render on the server pass
  if (!isMounted) return null;

  const isAllowed = hasRole(allowedRoles);

  if (!isAllowed) {
    if (!showErrorPage) return <>{fallback}</>;
    
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center px-4 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Akses Ditolak</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Maaf, role <span className="font-semibold text-slate-800 capitalize">{currentMember?.role || 'anda'}</span> tidak memiliki izin untuk mengakses halaman ini. 
          Hubungi owner atau admin jika Anda memerlukan akses.
        </p>
        <Link href="/dashboard" className="btn btn-primary btn-lg w-full justify-center">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
