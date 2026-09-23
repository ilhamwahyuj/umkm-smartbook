"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Reusable Modal Component ──────────────────────────────────────────────
function Modal({
  open,
  onClose,
  title,
  icon,
  iconBg,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  iconBg?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className={cn("relative bg-surface-card rounded-2xl shadow-2xl w-full p-6 lg:p-8 animate-scale-in border border-border-subtle flex flex-col gap-5", maxWidth)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg || "bg-primary-fixed text-primary")}>
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
              </div>
            )}
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast Notification ────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-status-success text-white",
    error: "bg-status-danger text-white",
    info: "bg-primary text-on-primary",
  };
  const icons = { success: "check_circle", error: "error", info: "info" };

  return (
    <div className={cn("fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl animate-slide-up font-label-md text-label-md", colors[type])}>
      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icons[type]}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────
interface DeviceSession {
  id: string;
  name: string;
  user: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  location: string;
  detail: string;
  status: string;
  statusColor: string;
  isCurrent: boolean;
  deviceType?: string;
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function KeamananPage() {
  const router = useRouter();

  // Toggle states
  const [voidPinRequired, setVoidPinRequired] = useState(true);
  const [limitShiftReport, setLimitShiftReport] = useState(true);
  const [autoLockTerminal, setAutoLockTerminal] = useState(true);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("••••••••••••••••");
  const [newPassword, setNewPassword] = useState("KopiSusu#2025Merdeka");
  const [confirmPassword, setConfirmPassword] = useState("KopiSusu#2025Merdeka");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState(0);

  // Section refs for scroll
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Modal states
  const [modalUnduh, setModalUnduh] = useState(false);
  const [modalKunci, setModalKunci] = useState(false);
  const [modalEditPin, setModalEditPin] = useState(false);
  const [modalPutusSemuaSesi, setModalPutusSemuaSesi] = useState(false);
  const [modalKeluarSesi, setModalKeluarSesi] = useState<string | null>(null);
  const [modalBackupCodes, setModalBackupCodes] = useState(false);
  const [modalPindah2FA, setModalPindah2FA] = useState(false);
  const [modalTambahStaf, setModalTambahStaf] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  // PIN edit states
  const [pinOld, setPinOld] = useState("");
  const [pinNew, setPinNew] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");

  // Kunci Terminal PIN
  const [kunciPin, setKunciPin] = useState("");

  // Unduh format
  const [unduhFormat, setUnduhFormat] = useState<"pdf" | "csv">("pdf");

  // Tambah staf form
  const [stafNama, setStafNama] = useState("");
  const [stafRole, setStafRole] = useState("kasir");
  const [stafPin, setStafPin] = useState("");

  // Pindah 2FA wizard step
  const [wizardStep, setWizardStep] = useState(0);

  // Device sessions
  const [devices, setDevices] = useState<DeviceSession[]>([
    {
      id: "dev-1",
      name: "MacBook Air M2 — Dewi Astuti (Owner)",
      user: "Dewi Astuti",
      icon: "laptop_mac",
      badge: "Perangkat Ini",
      badgeColor: "bg-status-success-bg text-status-success border-status-success/20",
      location: "Jakarta Selatan",
      detail: "Google Chrome • macOS Sonoma",
      status: "Sedang Aktif",
      statusColor: "text-status-success",
      isCurrent: true,
    },
    {
      id: "dev-2",
      name: "POS Register 01 — Kasir Meja Depan",
      user: "Kasir Meja Depan",
      icon: "tablet_android",
      badge: "Samsung Tab S9",
      badgeColor: "bg-status-info-bg border-status-info/20 text-status-info",
      location: "Cabang Jakarta Barat",
      detail: "Smartbook POS v3.4.1 (Dedicated App)",
      status: "Sedang Aktif (Shift Pagi)",
      statusColor: "text-status-success",
      isCurrent: false,
      deviceType: "tablet",
    },
    {
      id: "dev-3",
      name: "POS Mobile 02 — Waiter Siti Aminah",
      user: "Siti Aminah",
      icon: "smartphone",
      badge: "iPhone 13",
      badgeColor: "bg-surface-container-low text-secondary",
      location: "WiFi Toko Berkah 5G",
      detail: "Smartbook Waiter App",
      status: "Aktif 12 menit lalu",
      statusColor: "text-secondary",
      isCurrent: false,
    },
  ]);

  // Backup codes
  const backupCodes = ["A7K2-M9X1", "B3P8-Q4R6", "C5T0-W2Y7", "D1F9-V8N3", "E6H4-J7L2", "F2G5-U0S8", "G8K1-X3Z6", "H4M7-P9R2"];

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const scrollToSection = (index: number) => {
    setActiveTab(index);
    sectionRefs[index]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Password strength calculator
  const calculateStrength = (pw: string): { score: number; label: string; checks: { min10: boolean; upperLower: boolean; numeric: boolean; special: boolean } } => {
    const checks = {
      min10: pw.length >= 10,
      upperLower: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
      numeric: /\d/.test(pw),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.min(100, passed * 23 + (pw.length > 14 ? 8 : 0));
    const label = score >= 80 ? "Kuat & Memenuhi Standar FinTech" : score >= 50 ? "Sedang" : "Lemah";
    return { score, label, checks };
  };

  const strength = calculateStrength(newPassword);

  const handleSavePassword = () => {
    if (!currentPassword) { showToast("Masukkan kata sandi saat ini", "error"); return; }
    if (newPassword.length < 8) { showToast("Kata sandi baru minimal 8 karakter", "error"); return; }
    if (newPassword !== confirmPassword) { showToast("Konfirmasi sandi tidak cocok", "error"); return; }
    if (strength.score < 50) { showToast("Kata sandi terlalu lemah", "error"); return; }
    showToast("Kata sandi berhasil diperbarui!", "success");
  };

  const handleResetPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPw(false);
    setShowNewPw(false);
    setShowConfirmPw(false);
    showToast("Form sandi direset", "info");
  };

  const handleSavePin = () => {
    if (pinOld.length !== 6) { showToast("PIN lama harus 6 digit", "error"); return; }
    if (pinNew.length !== 6) { showToast("PIN baru harus 6 digit", "error"); return; }
    if (pinNew !== pinConfirm) { showToast("Konfirmasi PIN tidak cocok", "error"); return; }
    setPinOld(""); setPinNew(""); setPinConfirm("");
    setModalEditPin(false);
    showToast("PIN otorisasi berhasil diubah!", "success");
  };

  const handleKunciTerminal = () => {
    if (kunciPin.length < 4) { showToast("Masukkan PIN konfirmasi", "error"); return; }
    setKunciPin("");
    setModalKunci(false);
    showToast("Semua terminal kasir telah dikunci darurat!", "info");
  };

  const handleUnduhLaporan = () => {
    setModalUnduh(false);
    showToast(`Laporan audit (${unduhFormat.toUpperCase()}) sedang diunduh...`, "success");
  };

  const handleKeluarSesi = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    setModalKeluarSesi(null);
    showToast("Sesi perangkat berhasil dikeluarkan", "success");
  };

  const handlePutusSemuaSesi = () => {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
    setModalPutusSemuaSesi(false);
    showToast("Semua sesi lain berhasil diputus", "success");
  };

  const handleTambahStaf = () => {
    if (!stafNama.trim()) { showToast("Nama staf wajib diisi", "error"); return; }
    if (stafPin.length !== 6) { showToast("PIN harus 6 digit", "error"); return; }
    setStafNama(""); setStafRole("kasir"); setStafPin("");
    setModalTambahStaf(false);
    showToast(`Staf "${stafNama}" berhasil ditambahkan!`, "success");
  };

  // Tab data
  const tabs = [
    { label: "Keamanan Login & Sandi", icon: "shield", fill: true },
    { label: "Role & Hak Akses Staf", icon: "manage_accounts" },
    { label: "Sesi Perangkat Kasir Terhubung", icon: "devices", badge: devices.length },
    { label: "Log Aktivitas Audit", icon: "history" },
  ];

  return (
    <div className="flex flex-col w-full gap-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Keamanan & Hak Akses</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success-bg text-status-success font-label-md text-label-md shadow-sm">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Tingkat Keamanan: Sangat Baik (85%)
            </span>
          </div>
          <p className="font-body-md text-body-md text-secondary max-w-3xl">
            Kelola otentikasi multi-faktor, proteksi PIN kasir bertingkat, monitoring sesi terminal POS, dan jejak audit kepatuhan merchant.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button onClick={() => setModalUnduh(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            Unduh Laporan Audit
          </button>
          <button onClick={() => setModalKunci(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            Kunci Terminal Darurat
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md shadow-sm transition-all whitespace-nowrap",
              activeTab === i
                ? "bg-primary-fixed text-on-primary-fixed"
                : "bg-surface-card border border-border-subtle text-secondary hover:bg-surface-container-low hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined text-[18px]" style={tab.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{tab.icon}</span>
            {tab.label}
            {tab.badge && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] bg-primary text-on-primary font-bold">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* ═══ Section 1: Kredensial & Pembaharuan Kata Sandi ═══ */}
          <div ref={sectionRefs[0]} className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">password</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Kredensial & Pembaharuan Kata Sandi</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Amankan akun induk pemilik toko dengan kata sandi terenkripsi tingkat tinggi.</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container-low px-3 py-1 rounded-lg self-start sm:self-auto">
                Diubah 42 hari lalu
              </span>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Kata Sandi Saat Ini</label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner"
                    placeholder="Masukkan sandi saat ini"
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button className="absolute right-3 text-secondary hover:text-on-surface transition-colors" type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                    <span className="material-symbols-outlined text-[20px]">{showCurrentPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="newPassword">Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner"
                    id="newPassword"
                    placeholder="Kombinasi huruf, angka & simbol"
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button className="absolute right-3 text-secondary hover:text-on-surface transition-colors" type="button" onClick={() => setShowNewPw(!showNewPw)}>
                    <span className="material-symbols-outlined text-[20px]">{showNewPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Ulangi Kata Sandi Baru</label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner"
                    placeholder="Ketik kembali sandi baru"
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button className="absolute right-3 text-secondary hover:text-on-surface transition-colors" type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                    <span className="material-symbols-outlined text-[20px]">
                      {confirmPassword === newPassword && newPassword.length > 0 ? "check_circle" : showConfirmPw ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-secondary">Kekuatan Sandi: <span className={cn("font-bold", strength.score >= 80 ? "text-status-success" : strength.score >= 50 ? "text-status-warning" : "text-status-danger")}>{strength.label}</span></span>
                  <span className={cn("font-label-sm text-label-sm", strength.score >= 80 ? "text-status-success" : strength.score >= 50 ? "text-status-warning" : "text-status-danger")}>{strength.score} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-full w-1/4 rounded-full transition-colors duration-500",
                      i < Object.values(strength.checks).filter(Boolean).length
                        ? strength.score >= 80 ? "bg-status-success" : strength.score >= 50 ? "bg-status-warning" : "bg-status-danger"
                        : "bg-surface-container-low"
                    )} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-secondary font-label-sm text-label-sm">
                  <span className={cn("inline-flex items-center gap-1", strength.checks.min10 ? "text-status-success" : "text-secondary")}>
                    <span className="material-symbols-outlined text-[14px]">{strength.checks.min10 ? "check" : "close"}</span> Min. 10 karakter
                  </span>
                  <span className={cn("inline-flex items-center gap-1", strength.checks.upperLower ? "text-status-success" : "text-secondary")}>
                    <span className="material-symbols-outlined text-[14px]">{strength.checks.upperLower ? "check" : "close"}</span> Huruf besar & kecil
                  </span>
                  <span className={cn("inline-flex items-center gap-1", strength.checks.numeric ? "text-status-success" : "text-secondary")}>
                    <span className="material-symbols-outlined text-[14px]">{strength.checks.numeric ? "check" : "close"}</span> Angka numerik
                  </span>
                  <span className={cn("inline-flex items-center gap-1", strength.checks.special ? "text-status-success" : "text-secondary")}>
                    <span className="material-symbols-outlined text-[14px]">{strength.checks.special ? "check" : "close"}</span> Karakter unik (!@#$)
                  </span>
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button onClick={handleResetPassword} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 hover:text-on-surface transition-colors" type="button">
                  Batalkan
                </button>
                <button onClick={handleSavePassword} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all" type="button">
                  Simpan Pembaharuan Sandi
                </button>
              </div>
            </form>
          </div>

          {/* ═══ Section 2: PIN Otorisasi Kasir & Kontrol Supervisor ═══ */}
          <div ref={sectionRefs[1]} className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6 scroll-mt-24">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-warning-bg flex items-center justify-center text-status-warning">
                  <span className="material-symbols-outlined text-[22px]">pin</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">PIN Otorisasi Kasir & Kontrol Supervisor</h2>
                    <span className="px-2 py-0.5 rounded-md bg-status-warning-bg text-status-warning font-label-sm text-label-sm">Penting untuk POS</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Cegah fraud di meja kasir dengan mewajibkan verifikasi PIN pada transaksi sensitif.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-canvas border border-border-subtle p-5 rounded-xl">
              <div className="md:col-span-5 flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface">PIN Otorisasi Aktif (6-Digit)</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["8", "4", "2", "•", "•", "•"].map((d, i) => (
                      <span key={i} className="w-8 h-9 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center font-price-display text-base font-bold shadow-sm">{d}</span>
                    ))}
                  </div>
                  <button onClick={() => setModalEditPin(true)} className="p-2 rounded-lg bg-surface-card border border-border-subtle text-secondary hover:text-on-surface shadow-sm transition-colors" title="Ubah PIN">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Digunakan saat kasir meminta approval pembatalan struk, diskon khusus, atau pembukaan manual laci kasir (drawer).
                </p>
              </div>

              <div className="md:col-span-7 flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface">Kebijakan Otorisasi Otomatis</span>

                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Wajibkan PIN saat Void Transaksi</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kasir tidak dapat menghapus pesanan yang sudah tercetak di dapur tanpa PIN supervisor.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={voidPinRequired} onChange={(e) => setVoidPinRequired(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Batasi Laporan Shift Kasir</span>
                    <span className="font-body-sm text-body-sm text-secondary">Kasir biasa hanya dapat melihat total omset shift aktif mereka, bukan ringkasan toko keseluruhan.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={limitShiftReport} onChange={(e) => setLimitShiftReport(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3 bg-surface-card border border-border-subtle p-3 rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface">Auto-Lock Terminal Kasir (5 Menit)</span>
                    <span className="font-body-sm text-body-sm text-secondary">Otomatis kembali ke layar login PIN jika terminal ditinggalkan tanpa aktivitas transaksi.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={autoLockTerminal} onChange={(e) => setAutoLockTerminal(e.target.checked)} />
                    <div className="w-11 h-6 bg-secondary-fixed-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Section 3: Daftar Sesi Perangkat Kasir Terhubung ═══ */}
          <div ref={sectionRefs[2]} className="bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border-subtle flex flex-col gap-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-info-bg flex items-center justify-center text-status-info">
                  <span className="material-symbols-outlined text-[22px]">devices_other</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Daftar Sesi Perangkat Kasir Terhubung</h2>
                  <p className="font-body-sm text-body-sm text-secondary">Monitor tablet register, ponsel pramusaji, dan komputer pengelola cabang.</p>
                </div>
              </div>
              <button
                onClick={() => setModalPutusSemuaSesi(true)}
                disabled={devices.filter(d => !d.isCurrent).length === 0}
                className={cn(
                  "px-4 py-2 rounded-xl font-label-md text-label-md transition-colors self-start sm:self-auto flex items-center gap-1.5",
                  devices.filter(d => !d.isCurrent).length > 0
                    ? "bg-status-danger-bg text-status-danger hover:bg-red-100"
                    : "bg-surface-container-low text-secondary cursor-not-allowed opacity-50"
                )}
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Putuskan Semua Sesi Lain
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {devices.map((device) => (
                <div key={device.id} className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="flex items-center gap-3.5">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      device.isCurrent ? "bg-primary/10 text-primary" : "bg-surface-container-high text-secondary"
                    )}>
                      <span className="material-symbols-outlined text-[24px]">{device.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-label-lg text-on-surface">{device.name}</span>
                        {device.badge && (
                          <span className={cn("px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold border", device.badgeColor)}>
                            {device.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-secondary font-body-sm text-body-sm mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">{device.isCurrent ? "location_on" : device.deviceType === "tablet" ? "storefront" : "wifi"}</span>
                          {device.location}
                        </span>
                        <span>•</span>
                        <span>{device.detail}</span>
                        <span>•</span>
                        <span className={cn("font-semibold", device.statusColor)}>{device.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {device.isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-primary font-label-sm text-label-sm shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Sesi Utama
                      </span>
                    ) : (
                      <button
                        onClick={() => setModalKeluarSesi(device.id)}
                        className="px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-status-danger hover:bg-status-danger-bg font-label-sm text-label-sm shadow-sm transition-colors"
                      >
                        Keluar Sesi
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {devices.length === 1 && (
                <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle text-center text-secondary font-body-sm text-body-sm">
                  Tidak ada sesi perangkat lain yang aktif.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* ═══ Verifikasi 2FA ═══ */}
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Verifikasi 2FA</h3>
                  <span className="font-label-sm text-label-sm text-status-success font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> Aktif & Terlindungi
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-status-success text-[24px]">check_circle</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary">
              Setiap login dari perangkat baru mewajibkan kode 6-digit dari aplikasi authenticator untuk melindungi data finansial toko.
            </p>

            <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">phone_android</span>
                  <span className="font-label-md text-label-md text-on-surface">Google Authenticator</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">Utama</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">sms</span>
                  <span className="font-label-md text-label-md text-on-surface">SMS OTP (+62 812-****-8890)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm">Cadangan</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button onClick={() => setModalBackupCodes(true)} className="w-full py-2.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                Kelola Kunci Cadangan (Backup Codes)
              </button>
              <button onClick={() => { setWizardStep(0); setModalPindah2FA(true); }} className="w-full py-2.5 rounded-xl bg-surface-card border border-border-subtle hover:bg-surface-canvas text-secondary font-label-md text-label-md transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">cached</span>
                Pindahkan ke HP Baru
              </button>
            </div>
          </div>

          {/* ═══ Akses Peran & Staf ═══ */}
          <div ref={sectionRefs[1]} className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Akses Peran & Staf</h3>
                  <p className="font-body-sm text-body-sm text-secondary">4 Staf Aktif Terdaftar</p>
                </div>
              </div>
              <button onClick={() => setModalTambahStaf(true)} className="p-1.5 rounded-lg text-primary hover:bg-primary-fixed transition-colors">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { name: "Dewi Astuti", role: "Owner • Akses Penuh", badge: "Admin", badgeClass: "bg-primary/15 text-primary border-primary/20", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR3p40t2DUe9GOcZ9-dTa9NXvSgH1YHj7SrPZKz6itCN_KvoGN5hh-Dihk1yZN08x6SMLo_SrTy1Z0nrm3S6vFyddseZTkmVgkTkYym_PnD6wuSh6Cz8HKbYGoPSwCG9GlPsqbjLIQCs5Av4w9O3r4xMrBU4fgxkxP_MxsIy1dLvydqUS6i9-ve1uGTQUqP_gXDdG3y__GbqPm2xlRCqKCrK-2wCOnrQni6m53eQ7vMmRNAqX2AtyE" },
                { name: "Budi Santoso", role: "Supervisor Toko", badge: "PIN Void", badgeClass: "bg-status-info-bg border-status-info/20 text-status-info", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6WpTZD9GafiYBorE6vYu10T0d4zr1kixCpM3rPNHANDNb0MfKgdVbRKWbkhFYnWQ6Aho-kdGtYjjumVoMeX7jSbq8irm0kJOuAdSQdcapyb7VlqHzxQ2lytEWh5qIwwdyE_5yxucqEiRBMNnCvpsRiZUIX73k8cOc0G4XcQltHiBQISrnecQ64dcqv8gF4DKS-oe5ttgU78QRij582AtBhSikHHPIsuvS16x68d1Uhk3VoYFBJrvV" },
                { name: "Siti Aminah", role: "Kasir & Waiter", badge: "Kasir Saja", badgeClass: "bg-surface-container-low text-secondary border-border-subtle", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuASdSs5t1UfVM7g88XJ6SiC-KyEavBEZY8QsYUotx0Mzq5fP2gMW_77K2DwfSGQSEQLRWnpTMX9U3Xilsw-I4qw7O2JRtLbe742Xgqm65eaY-2QbrdCPig7zNAU6nnZ_nFKmwdVZ-nKaRoarBvX07cuuuJu5I2rzcrK8roZUpkk4sLa1wF5uz0iafWInRHVyCjVT7nMAblceOde2EEf23MkN_zT0qCj4WGC8_a3sj6eG8rbBemLdVSk" },
              ].map((staf) => (
                <div key={staf.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-canvas border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <img className="w-9 h-9 rounded-full object-cover" alt={staf.name} src={staf.img} />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface">{staf.name}</span>
                      <span className="font-body-sm text-body-sm text-secondary">{staf.role}</span>
                    </div>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold border", staf.badgeClass)}>{staf.badge}</span>
                </div>
              ))}
            </div>

            <button onClick={() => router.push("/pengaturan/role")} className="w-full py-2.5 rounded-xl bg-surface-canvas border border-border-subtle hover:bg-slate-50 text-on-surface font-label-md text-label-md transition-colors text-center mt-1">
              Kelola Matriks Hak Akses Staf
            </button>
          </div>

          {/* ═══ Log Aktivitas Audit ═══ */}
          <div ref={sectionRefs[3]} className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-subtle flex flex-col gap-5 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-canvas text-secondary flex items-center justify-center border border-border-subtle">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Log Aktivitas Audit</h3>
                  <p className="font-body-sm text-body-sm text-secondary">Peristiwa keamanan terbaru</p>
                </div>
              </div>
              <button onClick={() => router.push("/pengaturan/log")} className="text-primary hover:underline font-label-sm text-label-sm">Lihat Semua</button>
            </div>

            <div className="relative flex flex-col gap-4 mt-2">
              {[
                { color: "bg-status-success", title: "Login Berhasil (2FA Terverifikasi)", time: "10:14 WIB", desc: "Dewi Astuti via MacBook Air M2 (IP: 180.252.71.4)" },
                { color: "bg-status-warning", title: "Void Transaksi #TRX-0032", time: "09:40 WIB", desc: "Diotorisasi PIN Supervisor Budi Santoso di POS Register 01" },
                { color: "bg-status-info", title: "Perubahan Harga Menu Produk", time: "Kemarin", desc: "Owner mengubah harga SKU-104 (Kopi Aren Latte) Rp 18k → Rp 20k" },
                { color: "bg-status-danger", title: "Percobaan PIN Salah 3x Ditolak", time: "2 Feb 2025", desc: "Upaya pembukaan cash drawer manual pada POS Mobile 02 diblokir." },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", log.color)}></div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface">{log.title}</span>
                      <span className="font-body-sm text-body-sm text-secondary">{log.time}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 mt-2 rounded-xl bg-status-success-bg border border-status-success/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-status-success text-[20px]">encrypted</span>
              <p className="font-body-sm text-body-sm text-teal-900 leading-snug">
                Log diaudit secara berkala dan terenkripsi HMAC-SHA256 sesuai standar regulasi Bank Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODALS
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* Modal: Unduh Laporan Audit */}
      <Modal open={modalUnduh} onClose={() => setModalUnduh(false)} title="Unduh Laporan Audit" icon="file_download" iconBg="bg-primary-fixed text-primary">
        <p className="font-body-md text-body-md text-secondary">Pilih format file laporan audit keamanan yang ingin diunduh.</p>
        <div className="flex gap-3">
          {(["pdf", "csv"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setUnduhFormat(fmt)}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                unduhFormat === fmt ? "border-primary bg-primary-fixed" : "border-border-subtle bg-surface-canvas hover:border-primary/50"
              )}
            >
              <span className="material-symbols-outlined text-[28px]">{fmt === "pdf" ? "picture_as_pdf" : "table_chart"}</span>
              <span className="font-label-lg text-label-lg text-on-surface uppercase">{fmt}</span>
              <span className="font-body-sm text-body-sm text-secondary">{fmt === "pdf" ? "Laporan visual" : "Data terstruktur"}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModalUnduh(false)} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleUnduhLaporan} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh {unduhFormat.toUpperCase()}
          </button>
        </div>
      </Modal>

      {/* Modal: Kunci Terminal Darurat */}
      <Modal open={modalKunci} onClose={() => setModalKunci(false)} title="Kunci Terminal Darurat" icon="lock_reset" iconBg="bg-status-danger-bg text-status-danger">
        <div className="p-4 rounded-xl bg-status-danger-bg/50 border border-status-danger/20">
          <p className="font-body-md text-body-md text-status-danger flex items-start gap-2">
            <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">warning</span>
            Tindakan ini akan <strong>mengunci semua terminal kasir</strong> secara instan. Semua transaksi aktif akan dihentikan dan kasir harus login ulang.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface">Masukkan PIN Konfirmasi</label>
          <input
            className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-status-danger/50 shadow-inner tracking-[0.3em] text-center"
            placeholder="••••••"
            type="password"
            maxLength={6}
            value={kunciPin}
            onChange={(e) => setKunciPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => { setKunciPin(""); setModalKunci(false); }} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleKunciTerminal} className="px-6 py-2.5 rounded-xl bg-status-danger text-white font-label-lg text-label-lg shadow-sm hover:bg-red-600 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Kunci Semua Terminal
          </button>
        </div>
      </Modal>

      {/* Modal: Edit PIN */}
      <Modal open={modalEditPin} onClose={() => { setPinOld(""); setPinNew(""); setPinConfirm(""); setModalEditPin(false); }} title="Ubah PIN Otorisasi" icon="pin" iconBg="bg-status-warning-bg text-status-warning">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">PIN Lama (6 Digit)</label>
            <input className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner tracking-[0.3em] text-center" placeholder="••••••" type="password" maxLength={6} value={pinOld} onChange={(e) => setPinOld(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">PIN Baru (6 Digit)</label>
            <input className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner tracking-[0.3em] text-center" placeholder="••••••" type="password" maxLength={6} value={pinNew} onChange={(e) => setPinNew(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Konfirmasi PIN Baru</label>
            <input className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner tracking-[0.3em] text-center" placeholder="••••••" type="password" maxLength={6} value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))} />
            {pinNew && pinConfirm && pinNew !== pinConfirm && (
              <span className="font-body-sm text-body-sm text-status-danger flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span> PIN tidak cocok
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => { setPinOld(""); setPinNew(""); setPinConfirm(""); setModalEditPin(false); }} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleSavePin} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">Simpan PIN Baru</button>
        </div>
      </Modal>

      {/* Modal: Putuskan Semua Sesi */}
      <Modal open={modalPutusSemuaSesi} onClose={() => setModalPutusSemuaSesi(false)} title="Putuskan Semua Sesi Lain" icon="logout" iconBg="bg-status-danger-bg text-status-danger">
        <div className="p-4 rounded-xl bg-status-danger-bg/50 border border-status-danger/20">
          <p className="font-body-md text-body-md text-status-danger">
            <strong>{devices.filter(d => !d.isCurrent).length} perangkat</strong> akan dikeluarkan dari sesi aktif. Semua kasir dan waiter harus login ulang.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {devices.filter(d => !d.isCurrent).map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-canvas border border-border-subtle">
              <span className="material-symbols-outlined text-secondary">{d.icon}</span>
              <span className="font-label-md text-label-md text-on-surface">{d.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModalPutusSemuaSesi(false)} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handlePutusSemuaSesi} className="px-6 py-2.5 rounded-xl bg-status-danger text-white font-label-lg text-label-lg shadow-sm hover:bg-red-600 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Putuskan Semua
          </button>
        </div>
      </Modal>

      {/* Modal: Keluar Sesi per perangkat */}
      <Modal
        open={modalKeluarSesi !== null}
        onClose={() => setModalKeluarSesi(null)}
        title="Keluarkan Sesi Perangkat"
        icon="smartphone"
        iconBg="bg-status-danger-bg text-status-danger"
      >
        {modalKeluarSesi && (() => {
          const device = devices.find(d => d.id === modalKeluarSesi);
          if (!device) return null;
          return (
            <>
              <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[24px]">{device.icon}</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">{device.name}</span>
                  <span className="font-body-sm text-body-sm text-secondary">{device.location} • {device.status}</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-secondary">
                Perangkat ini akan dikeluarkan dari sesi dan pengguna harus login ulang untuk mengakses kembali.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setModalKeluarSesi(null)} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
                <button onClick={() => handleKeluarSesi(device.id)} className="px-6 py-2.5 rounded-xl bg-status-danger text-white font-label-lg text-label-lg shadow-sm hover:bg-red-600 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Keluarkan Sesi
                </button>
              </div>
            </>
          );
        })()}
      </Modal>

      {/* Modal: Kelola Kunci Cadangan (Backup Codes) */}
      <Modal open={modalBackupCodes} onClose={() => setModalBackupCodes(false)} title="Kunci Cadangan (Backup Codes)" icon="key" iconBg="bg-primary-fixed text-primary" maxWidth="max-w-md">
        <div className="p-4 rounded-xl bg-status-warning-bg/50 border border-status-warning/20">
          <p className="font-body-sm text-body-sm text-status-warning flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">warning</span>
            Simpan kode-kode ini di tempat aman. Setiap kode hanya bisa digunakan satu kali sebagai pengganti 2FA.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, i) => (
            <div key={i} className="p-3 rounded-xl bg-surface-canvas border border-border-subtle text-center font-mono font-bold text-on-surface tracking-wider text-sm">
              {code}
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(backupCodes.join("\n"));
              showToast("Kode cadangan disalin ke clipboard", "success");
            }}
            className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-label-lg text-label-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            Salin Semua
          </button>
          <button onClick={() => setModalBackupCodes(false)} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">Tutup</button>
        </div>
      </Modal>

      {/* Modal: Pindahkan 2FA ke HP Baru */}
      <Modal open={modalPindah2FA} onClose={() => setModalPindah2FA(false)} title="Pindahkan 2FA ke HP Baru" icon="cached" iconBg="bg-status-info-bg text-status-info" maxWidth="max-w-md">
        {wizardStep === 0 && (
          <>
            <div className="flex items-center gap-3 mb-2">
              {[0, 1, 2].map((s) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", s <= wizardStep ? "bg-primary" : "bg-surface-container-low")} />
              ))}
            </div>
            <div className="p-4 rounded-xl bg-surface-canvas border border-border-subtle text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[48px]">qr_code_2</span>
              <p className="font-body-md text-body-md text-secondary">
                Scan QR Code ini menggunakan aplikasi <strong>Google Authenticator</strong> di HP baru Anda.
              </p>
              <div className="w-40 h-40 bg-surface-container-low rounded-xl border-2 border-dashed border-border-subtle flex items-center justify-center">
                <span className="font-label-sm text-label-sm text-secondary text-center">QR Code<br />Placeholder</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModalPindah2FA(false)} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={() => setWizardStep(1)} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">Sudah Scan →</button>
            </div>
          </>
        )}
        {wizardStep === 1 && (
          <>
            <div className="flex items-center gap-3 mb-2">
              {[0, 1, 2].map((s) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", s <= wizardStep ? "bg-primary" : "bg-surface-container-low")} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-body-md text-body-md text-secondary">Masukkan kode 6-digit dari Google Authenticator di <strong>HP baru</strong> untuk verifikasi:</p>
              <input className="w-full h-12 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-lg text-body-lg focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner tracking-[0.5em] text-center" placeholder="000000" maxLength={6} />
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => setWizardStep(0)} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">← Kembali</button>
              <button onClick={() => setWizardStep(2)} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">Verifikasi →</button>
            </div>
          </>
        )}
        {wizardStep === 2 && (
          <>
            <div className="flex items-center gap-3 mb-2">
              {[0, 1, 2].map((s) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", s <= wizardStep ? "bg-primary" : "bg-surface-container-low")} />
              ))}
            </div>
            <div className="p-6 rounded-xl bg-status-success-bg border border-status-success/20 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-status-success text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface">2FA Berhasil Dipindahkan!</h4>
              <p className="font-body-sm text-body-sm text-secondary">Authenticator di HP lama sudah tidak aktif. Gunakan HP baru untuk verifikasi login selanjutnya.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => { setModalPindah2FA(false); showToast("2FA berhasil dipindahkan ke HP baru!", "success"); }} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">Selesai</button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal: Tambah Staf */}
      <Modal open={modalTambahStaf} onClose={() => setModalTambahStaf(false)} title="Tambah Staf Baru" icon="person_add" iconBg="bg-primary-fixed text-primary">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Nama Lengkap</label>
            <input className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner" placeholder="Masukkan nama staf" value={stafNama} onChange={(e) => setStafNama(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Role / Peran</label>
            <select className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner appearance-none" value={stafRole} onChange={(e) => setStafRole(e.target.value)}>
              <option value="kasir">Kasir Saja</option>
              <option value="waiter">Waiter</option>
              <option value="kasir_waiter">Kasir & Waiter</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">PIN Staf (6 Digit)</label>
            <input className="w-full h-11 px-4 rounded-xl bg-surface-canvas border border-border-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-inner tracking-[0.3em] text-center" placeholder="••••••" type="password" maxLength={6} value={stafPin} onChange={(e) => setStafPin(e.target.value.replace(/\D/g, ""))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => { setStafNama(""); setStafRole("kasir"); setStafPin(""); setModalTambahStaf(false); }} className="px-5 py-2.5 rounded-xl bg-surface-canvas border border-border-subtle text-secondary font-label-lg text-label-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleTambahStaf} className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Tambah Staf
          </button>
        </div>
      </Modal>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
