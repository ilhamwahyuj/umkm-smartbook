"use client";
// src/components/ui/KPICard.tsx
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatRupiah, formatPercent } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  changePercent?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  compact?: boolean;
  className?: string;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  changePercent,
  icon,
  iconBg = "bg-emerald-50",
  compact = false,
  className,
  loading = false,
}: KPICardProps) {
  const isPositive = changePercent !== undefined && changePercent >= 0;

  if (loading) {
    return (
      <div className={cn("bg-white border border-gray-100 rounded-xl p-6 shadow-sm", className)}>
        <div className="skeleton h-4 w-24 mb-3" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={cn("bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in group relative overflow-hidden", className)}>
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-4">
        <p className="text-slate-500 text-[13px] font-semibold uppercase tracking-wider">{title}</p>
        {icon && (
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", iconBg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-3xl font-black text-slate-900 tracking-tighter animate-count-up">
          {formatRupiah(value, { compact })}
        </p>
      </div>

      {changePercent !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {formatPercent(changePercent)}
          </span>
          <span className="text-xs text-slate-400">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
}
