"use client";
import Link from "next/link";
import { 
  Building2, Users, CreditCard, Shield, Bell, Package,
  AlertTriangle, DollarSign, TrendingUp, FileText
} from "lucide-react";

type SettingItem = {
  label: string;
  desc: string;
  href?: string;
};

type SettingGroup = {
  label: string;
  icon: any;
  items: SettingItem[];
};

const settingGroups: SettingGroup[] = [
  {
    label: "Bisnis",
    icon: Building2,
    items: [
      { label: "Profil Usaha", desc: "Nama, logo, alamat, nomor telepon", href: "/pengaturan/profil-usaha" },
      { label: "Jenis Usaha", desc: "Konfigurasi berdasarkan tipe bisnis", href: "/pengaturan/jenis-usaha" },
      { label: "Pajak", desc: "Pengaturan PPN dan pajak lainnya", href: "/pengaturan/pajak" },
    ],
  },
  {
    label: "Produk",
    icon: Package,
    items: [
      { label: "Kategori Produk", desc: "Kelola kategori barang", href: "/pengaturan/kategori" },
      { label: "Satuan", desc: "pcs, kg, liter, lusin, dll", href: "/pengaturan/satuan" },
      { label: "Kategori Pengeluaran", desc: "Listrik, Internet, Gaji, dll", href: "/pengaturan/kategori-pengeluaran" },
    ],
  },
  {
    label: "Tim & Akses",
    icon: Users,
    items: [
      { label: "Anggota Tim", desc: "Undang dan kelola karyawan", href: "/pengaturan/pengguna" },
      { label: "Role & Izin", desc: "Owner, Admin, Kasir, Gudang, dll", href: "/pengaturan/role" },
    ],
  },
  {
    label: "Notifikasi",
    icon: Bell,
    items: [
      { label: "Peringatan Stok", desc: "Notifikasi ketika stok menipis", href: "/pengaturan/notif-stok" },
      { label: "Piutang Jatuh Tempo", desc: "Reminder pembayaran piutang", href: "/pengaturan/notif-piutang" },
      { label: "Laporan Harian", desc: "Ringkasan otomatis setiap hari", href: "/pengaturan/notif-laporan" },
    ],
  },
  {
    label: "Transaksi",
    icon: CreditCard,
    items: [
      { label: "Metode Pembayaran", desc: "Cash, Transfer, QRIS, E-Wallet", href: "/pengaturan/pembayaran" },
      { label: "Format Invoice", desc: "Header, footer, logo pada struk", href: "/pengaturan/invoice" },
      { label: "Diskon Default", desc: "Pengaturan diskon otomatis", href: "/pengaturan/diskon" },
    ],
  },
  {
    label: "Keamanan",
    icon: Shield,
    items: [
      { label: "Ganti Password", desc: "Perbarui password akun Anda", href: "/pengaturan/password" },
      { label: "Autentikasi 2 Faktor", desc: "Keamanan tambahan untuk akun", href: "/pengaturan/2fa" },
      { label: "Log Aktivitas", desc: "Riwayat semua aksi pengguna", href: "/pengaturan/log" },
    ],
  },
];

const activityFeeds = [
  { icon: AlertTriangle, title: "Peringatan Stok Rendah", desc: "Toko Admin, stok produk menipis", time: "2 jam lalu" },
  { icon: DollarSign, title: "Piutang Jatuh Tempo", desc: "Rp2.500.000 dari Toko Store 10", time: "3 jam lalu" },
  { icon: TrendingUp, title: "Umpan Balik Omzet", desc: "Omzet bulan ini meningkat dibandingkan bulan lalu", time: "Hari ini" },
  { icon: FileText, title: "Laporan Harian Dibuat", desc: "Ringkasan otomatis hari ini sudah siap", time: "" },
];

export default function PengaturanPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-12">
      {/* Left Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi aplikasi sesuai kebutuhan bisnis Anda</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {settingGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="font-bold text-slate-900 text-base mb-3">{group.label}</h3>
                  <div className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <Link key={item.label} href={item.href || "#"} className="group block text-left">
                        <p className="font-bold text-slate-800 text-[13px] leading-tight group-hover:text-emerald-600 transition-colors underline decoration-transparent group-hover:decoration-emerald-600 underline-offset-2">
                          {item.label}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - Feed */}
      <div className="w-full lg:w-80 shrink-0 lg:mt-[76px]">
        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-[15px]">Umpan Aktivitas & Notifikasi</h3>
          </div>
          <div className="flex flex-col">
            {activityFeeds.map((feed, idx) => {
              const FeedIcon = feed.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FeedIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[13px] leading-tight">{feed.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{feed.desc}</p>
                    {feed.time && (
                      <p className="text-[11px] text-slate-400 mt-1.5">{feed.time}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
