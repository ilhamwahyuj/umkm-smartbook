"use client";
// src/components/charts/SalesLineChart.tsx
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatRupiah } from "@/lib/utils";
import type { SalesChartData } from "@/types/database";

interface SalesLineChartProps {
  data: SalesChartData[];
  height?: number;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{formatRupiah(payload[0].value)}</p>
      {payload[1] && (
        <p className="text-slate-400 text-xs mt-1">
          {payload[1].value} transaksi
        </p>
      )}
    </div>
  );
}

export function SalesLineChart({ data, height = 220 }: SalesLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(226,232,240)" strokeOpacity={0.5} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "rgb(100,116,139)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatRupiah(v, { compact: true })}
          tick={{ fontSize: 11, fill: "rgb(100,116,139)" }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="rgb(16, 185, 129)"
          strokeWidth={2.5}
          fill="url(#colorRevenue)"
          dot={{ r: 3, fill: "rgb(16, 185, 129)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "rgb(16, 185, 129)", strokeWidth: 2, stroke: "white" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
