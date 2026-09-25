"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── TYPES ──────────────────────────────────────────
type Category = "semua" | "kopi" | "makanan" | "dessert" | "bahan";
type OrderType = "dine-in" | "bungkus" | "antar";
type PaymentMethod = "qris" | "tunai" | "transfer" | "kasbon";
type ViewMode = "grid" | "list";

type Product = {
  id: string;
  sku: string;
  name: string;
  desc: string;
  price: number;
  stock: number;
  category: Category;
  image: string;
};

type CartItem = {
  product: Product;
  qty: number;
  notes: string;
  variants: string[];
};

// ─── PRODUCT DATA ───────────────────────────────────
const products: Product[] = [
  {
    id: "p1", sku: "KOP-01", name: "Kopi Susu Aren", desc: "2 Varian Rasa", price: 22000, stock: 48, category: "kopi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKprwMr7rNM8aJbjV9EzaGKwdlGzEQ-EUGdX1WrlagN8AJHJoCPnW1cZSDUejXnfyCzU_Xbd5cgXccaKtpzbODZWKGpMlzWGIwSg2SzJVwTBmEVEyL3__rHK-eydFSwio_HjOuBr3cInc86jaCnQ5v-gJLYeDWSW-ocT99zVQBnP4avaZpAu4VyJP4olS01n71JORIABldAcl_akdU-GZck8axXxCjgNelzF7Eug0r82WNhyjYPM1h",
  },
  {
    id: "p2", sku: "PAS-04", name: "Croissant Butter", desc: "Fresh Daily", price: 28000, stock: 19, category: "dessert",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5xUaxHBrUU2wNyBB2xy8yrYRENcjMuNeqbxkFYkeZHRMmSeTMrscX-vSMexV0vLEHo5Ciqze_85OyaiaSNE_ssmqd5EMje2KKwURMyBkNG6amf38sreqt5KhIBsf315IjpmR0orOLWJPTGjfOEKuCGFGag6u4DGS92okCjWYTJzpUSugExny6VptFT-O_nCKKWXH2v7D1eerlQBHhHera721iK4Mi4bBQJWdMGb0tblyWYwz5ETWf",
  },
  {
    id: "p3", sku: "MNU-09", name: "Matcha Latte", desc: "Uji Grade A", price: 26000, stock: 32, category: "kopi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mon_dEypws8015jfXnA4HPRWZ9Ur9bddW1Mbqzgew9axvog61XemHG-QB460Jq3kaw556c4m-uLOBb9uGnqBrVPLckSfEVYNYRP2T3pvJDh-6JK6pa9R2ROwOov_10f_04wPRQHudiuF--2U8yn3eXcTy5p7O94CLQszoYexGVPEWeqlKPRYAyDycUujbVEXfAGWpIyDZjC1Yz9u4KqR5dG7ZZEddyjrEB-vs11a3YZP9w8FoWLw",
  },
  {
    id: "p4", sku: "KOP-02", name: "Americano Ice", desc: "Single Origin Flores", price: 18000, stock: 4, category: "kopi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBver_pfsinFeUmMUks3SCwPI3pokgPgQ5FMEVHGHKdlIbqFiskoTNIfAQnMU_aaO0NET3BFE0LAXzS7HdnE71HQaRJRfV-5mhue-DtB3WvQdmppFp2OT1LJWNhTLMvQ7yVv0MnrNLqOdozldCClL1_DT1HnwYPvHTcPZCHi_3R--sUpaiBhKGgHe-xbEZSnM56gqT3fQBM2Ui0NBaubCxzjL9qvxWZwpUNfhZZ6HdhyhPasRSoPrin",
  },
  {
    id: "p5", sku: "SNK-11", name: "Toast Roti Bakar", desc: "Choco Melt", price: 20000, stock: 25, category: "makanan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk4PE_L96ZBJHUhUppGnArkjK2PsxpH-aSfmF4uK0XW0MS_tRftS7WC7b6ol2iqwKFzYEzjDgIQ_QEFH7PGkokE3nhutiGt76VgU1lWmLF8jWVnwPWLwOgxB6ZmCgmCkuf5Mgb3O_vf98xXkZYNqtF3zU03ENGKTpzDz5OZGoBMzjgrG0EM8jMRdoCJpdPpJlbhXyuBAOv9UebMf2jApHed68KmZcx1qUYMUJ_ZAnvi5zQaXzoAzwc",
  },
  {
    id: "p6", sku: "SNK-08", name: "French Fries", desc: "Truffle Mayo Dip", price: 18000, stock: 40, category: "makanan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX0fS4FmiuisAofnz64dX9L5rB7KMtFMC1EueqiyEsxh024_006C_ybMXEmRzHN4gpyBrWpJAIaA8u1iCdL2imGLOkW2FzU7jWBXMGqk70xQcIRDOzgHJRP3TFYuOsol8PBlP7LvOJucCKZXIf_-57EpIblsPKt_yfne9YeThsmSO5tsJDrVDnELuBq5pfP-yubBsyegl8fALCdOBcMoblEHO-3yxWhHgwVlwuCtwaahJpL0lPur3D",
  },
  {
    id: "p7", sku: "TEA-02", name: "Earl Grey Tea", desc: "Citrus Bergamot", price: 16000, stock: 60, category: "kopi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9qu7JZPrYS1KVO4Ufy5y1SVLuu92kil2PzFBDZ1QqICV_eatHKxFpb1P5S4oo9kcNetxc0RkO4nZNYOz4EdqvfRDyCjobgDuqBGlig0qOPRpAcl4_4m04xC27xYLlgesTUvchjP5RxPLbsFioHstpj9IgDphB4lnqX-stxLmRbj3PdGHz2NS3-Ed049-LKRfS2mOUpR0bGUjUQtpS1tB4StI7H8Tjj5-6KNvL93_nAEQLj1fvDIts",
  },
  {
    id: "p8", sku: "CAK-05", name: "Red Velvet Cake", desc: "Cream Cheese", price: 32000, stock: 12, category: "dessert",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5dLHMtNliDgzR7k17PrD_Be9AHBYOgmmaoB9mNrI-p17CgulXrQKpU6wNLmY2KvzSThP01FWUOt-ksvoBdhmYr1Sau2a3Z0cAKxgQsQSah01rNC_xvqqHeArfcBvOOnsmWjnNcH28PWGD-0yBxVTkjlimZyXf4WWolTNRsqqEDegOCR4o_ZHLCnToOzXCf3nWF-Hk_tTmRlkTqV1cfdbMBzh7WCZli8Sp42IfeckUVjjSWCiacAwC",
  },
];

const categories: { id: Category; label: string; emoji: string; count: number }[] = [
  { id: "semua", label: "Semua Produk", emoji: "", count: 128 },
  { id: "kopi", label: "Kopi & Minuman", emoji: "☕", count: 42 },
  { id: "makanan", label: "Makanan & Snack", emoji: "🥪", count: 36 },
  { id: "dessert", label: "Dessert & Pastry", emoji: "🍰", count: 24 },
  { id: "bahan", label: "Bahan Pokok", emoji: "🛒", count: 26 },
];

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

// ─── COMPONENT ──────────────────────────────────────
export default function KasirPOSPage() {
  // ── State ──
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], qty: 2, notes: "", variants: ["Less Sugar", "Ice"] },
    { product: products[1], qty: 1, notes: "", variants: ["Hangatkan / Warm"] },
    { product: products[2], qty: 1, notes: "", variants: [] },
  ]);
  const [activeCategory, setActiveCategory] = useState<Category>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [selectedCash, setSelectedCash] = useState<number | null>(null);
  const [showScanMode, setShowScanMode] = useState(false);
  const [showDraftPanel, setShowDraftPanel] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [showPayConfirm, setShowPayConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showLaciConfirm, setShowLaciConfirm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  const searchRef = useRef<HTMLInputElement>(null);

  // ── Calculations ──
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discount = 10000; // mock promo
  const taxRate = 0.1;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * taxRate);
  const grandTotal = taxableAmount + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const cashOptions = [
    grandTotal,
    Math.ceil(grandTotal / 5000) * 5000,
    Math.ceil(grandTotal / 10000) * 10000 + 10000,
    150000,
    200000,
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);

  // ── Cart Operations ──
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1, notes: "", variants: [] }];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id !== productId) return item;
      const newQty = item.qty + delta;
      return newQty > 0 ? { ...item, qty: newQty } : item;
    }).filter(item => item.qty > 0));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setShowCancelConfirm(false);
    showSuccess("Pesanan dibatalkan");
  }, []);

  const updateNote = useCallback((productId: string, note: string) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, notes: note } : i));
  }, []);

  const handlePay = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      const transactionData = {
        customer_name: customerName,
        order_type: orderType,
        payment_method: paymentMethod,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        grand_total: grandTotal,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          qty: item.qty,
          price: item.product.price,
          notes: item.notes,
          variants: item.variants
        }))
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData]);

      if (error) throw error;

      setShowPayConfirm(false);
      setCart([]);
      setSelectedCash(null);
      showSuccess("Pembayaran berhasil disimpan ke database!");
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      alert("Gagal menyimpan transaksi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [cart, customerName, orderType, paymentMethod, subtotal, discount, tax, grandTotal, supabase]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Filter Products ──
  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === "semua" || p.category === activeCategory;
    const matchSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // ── Cart item count per product ──
  const getCartQty = (productId: string) => cart.find(i => i.product.id === productId)?.qty || 0;

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "F1") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "F2") { e.preventDefault(); setShowScanMode(s => !s); }
      if (e.key === "F9" && cart.length > 0) { e.preventDefault(); setShowPayConfirm(true); }
      if (e.key === "Escape") { setShowPayConfirm(false); setShowCancelConfirm(false); setShowLaciConfirm(false); setShowDraftPanel(false); setShowCustomerPicker(false); setShowScanMode(false); setEditingNoteId(null); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cart.length]);

  // ── Stock label helper ──
  const stockLabel = (stock: number) => {
    if (stock <= 5) return { text: `Sisa ${stock} pcs`, cls: "bg-status-warning-bg text-status-warning" };
    return { text: `Stok ${stock}`, cls: "bg-surface-container-lowest/90 backdrop-blur-sm text-status-success" };
  };

  return (
    <div className="flex flex-col w-full">
      {/* ── SUCCESS TOAST ── */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-status-success text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* ── SUB-BAR KASIR ── */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>point_of_sale</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-semibold text-on-surface leading-tight">Kasir 1 • Budi Santoso</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-success-bg text-status-success">Online (Shift Pagi)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
              <span className="text-sm font-semibold tabular-nums text-primary">TRX-20260119-0042</span>
              <span>•</span>
              <span>Outlet Utama - Kopi Berkah Nusantara</span>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Customer Select */}
          <div className="relative">
            <button onClick={() => { setShowCustomerPicker(!showCustomerPicker); setShowDraftPanel(false); }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${showCustomerPicker ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'}`} type="button">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Pelanggan: <strong className="font-semibold">{customerName === "Walk-in Guest" ? "Walk-in" : customerName}</strong></span>
              <span className="material-symbols-outlined text-[11px]">arrow_drop_down</span>
            </button>
            {showCustomerPicker && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-border-subtle z-50 py-2">
                <p className="px-4 py-1.5 text-[10px] font-bold text-secondary uppercase tracking-wider">Pilih Pelanggan</p>
                {["Walk-in Guest", "Ahmad Rizky (Member)", "Siti Nurhaliza", "Dewi Anggraeni"].map(name => (
                  <button key={name} onClick={() => { setCustomerName(name); setShowCustomerPicker(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-surface-container transition-colors ${customerName === name ? 'text-primary bg-primary/5' : 'text-on-surface'}`} type="button">
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hold/Draft Orders */}
          <div className="relative">
            <button onClick={() => { setShowDraftPanel(!showDraftPanel); setShowCustomerPicker(false); }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${showDraftPanel ? 'bg-status-warning text-white' : 'bg-status-warning-bg hover:bg-status-warning-bg/80 text-status-warning'}`} type="button">
              <span className="material-symbols-outlined text-sm">pause_circle</span>
              <span>Tahan Draft</span>
              <span className="px-1.5 py-0.5 bg-status-warning text-white rounded-full text-[11px]">2</span>
            </button>
            {showDraftPanel && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-border-subtle z-50 py-2">
                <p className="px-4 py-1.5 text-[10px] font-bold text-secondary uppercase tracking-wider">Draft Tersimpan</p>
                <button className="w-full text-left px-4 py-3 hover:bg-surface-container transition-colors border-b border-border-subtle/30" type="button" onClick={() => { setShowDraftPanel(false); showSuccess("Draft dimuat"); }}>
                  <p className="text-xs font-bold text-on-surface">Draft #1 — Walk-in</p>
                  <p className="text-[11px] text-secondary mt-0.5">2 item • Rp 46.000 • 10 menit lalu</p>
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-surface-container transition-colors" type="button" onClick={() => { setShowDraftPanel(false); showSuccess("Draft dimuat"); }}>
                  <p className="text-xs font-bold text-on-surface">Draft #2 — Ahmad Rizky</p>
                  <p className="text-[11px] text-secondary mt-0.5">3 item • Rp 78.000 • 25 menit lalu</p>
                </button>
              </div>
            )}
          </div>

          {/* Barcode Scan Mode */}
          <button onClick={() => setShowScanMode(!showScanMode)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${showScanMode ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface'}`} type="button">
            <span className="material-symbols-outlined text-sm">barcode_scanner</span>
            <span>Scan (F2)</span>
          </button>

          {/* Cash Drawer */}
          <button onClick={() => setShowLaciConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-all shadow-sm" title="Buka laci uang kasir" type="button">
            <span className="material-symbols-outlined text-sm text-secondary">inventory</span>
            <span>Buka Laci</span>
          </button>
        </div>
      </div>

      {/* ── SCAN MODE BANNER ── */}
      {showScanMode && (
        <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary animate-pulse">barcode_scanner</span>
            <div>
              <p className="text-sm font-bold text-primary">Mode Scan Aktif</p>
              <p className="text-xs text-secondary">Arahkan barcode ke scanner atau ketik kode manual...</p>
            </div>
          </div>
          <button onClick={() => setShowScanMode(false)} className="px-3 py-1.5 bg-surface-container-lowest rounded-xl text-xs font-bold text-secondary hover:text-on-surface shadow-sm" type="button">Tutup (Esc)</button>
        </div>
      )}

      {/* ── MAIN POS LAYOUT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: PRODUCT CATALOG */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            {/* Search & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                <input
                  ref={searchRef}
                  className="w-full pl-10 pr-24 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest shadow-inner"
                  placeholder="Cari menu, SKU, atau scan barcode... (F1)"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-16 top-1/2 -translate-y-1/2 p-0.5 hover:bg-surface-container rounded-full text-secondary" type="button">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-surface-container-lowest rounded text-[11px] font-semibold text-secondary shadow-sm">Ctrl + F</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                <button onClick={() => setViewMode("grid")} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${viewMode === "grid" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-secondary hover:text-on-surface"}`} type="button">
                  <span className="material-symbols-outlined text-xs">grid_view</span>
                  <span>Grid</span>
                </button>
                <button onClick={() => setViewMode("list")} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${viewMode === "list" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-secondary hover:text-on-surface"}`} type="button">
                  <span className="material-symbols-outlined text-xs">view_list</span>
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${activeCategory === cat.id ? "bg-primary text-on-primary shadow-md shadow-primary/20" : "bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold"}`}
                  type="button"
                >
                  <span>{cat.emoji ? `${cat.emoji} ` : ""}{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${activeCategory === cat.id ? "bg-on-primary/20" : "bg-surface-container text-secondary"}`}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT CARDS */}
          {filteredProducts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-sm text-center">
              <span className="material-symbols-outlined text-4xl text-secondary">search_off</span>
              <p className="text-sm font-semibold text-secondary mt-2">Produk tidak ditemukan</p>
              <p className="text-xs text-secondary mt-1">Coba ubah kata kunci atau kategori</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const cartQty = getCartQty(product.id);
                const sl = stockLabel(product.stock);
                return (
                  <div key={product.id} className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative cursor-pointer" onClick={() => addToCart(product)}>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-3">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.name} src={product.image} />
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-bold ${sl.cls}`}>{sl.text}</span>
                      {cartQty > 0 && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center shadow-md">{cartQty}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest">SKU: {product.sku}</span>
                      <h3 className="text-[16px] font-semibold text-on-surface leading-tight group-hover:text-primary transition-colors mt-1">{product.name}</h3>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-surface-container-low text-secondary text-[11px] font-semibold rounded">{product.desc}</span>
                    </div>
                    <div className="mt-3 pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-secondary block">Harga</span>
                        <span className="text-sm font-semibold tabular-nums text-primary">{formatRupiah(product.price)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all ${cartQty > 0 ? "bg-primary text-on-primary hover:bg-primary/90" : "bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary"}`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="flex flex-col gap-2">
              {filteredProducts.map(product => {
                const cartQty = getCartQty(product.id);
                const sl = stockLabel(product.stock);
                return (
                  <div key={product.id} className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group" onClick={() => addToCart(product)}>
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                      <img className="w-full h-full object-cover" alt={product.name} src={product.image} />
                      {cartQty > 0 && <span className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">{cartQty}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary truncate">{product.name}</h3>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${sl.cls}`}>{sl.text}</span>
                      </div>
                      <p className="text-[11px] text-secondary mt-0.5">SKU: {product.sku} • {product.desc}</p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-primary shrink-0">{formatRupiah(product.price)}</span>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0" type="button">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: ACTIVE CART & CHECKOUT */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col border border-border-subtle/50">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-extrabold text-on-surface">Pesanan Baru</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">{totalItems} Item</span>
              </div>
              <button onClick={() => cart.length > 0 && setShowCancelConfirm(true)} className="p-1.5 text-status-danger hover:bg-status-danger-bg rounded-lg transition-colors" title="Reset Keranjang" type="button">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
              </button>
            </div>

            {/* Order Type Toggle */}
            <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl mb-4 text-center">
              {([["dine-in", "table_restaurant", "Dine In"], ["bungkus", "takeout_dining", "Bungkus"], ["antar", "moped", "Antar"]] as const).map(([type, icon, label]) => (
                <button key={type} onClick={() => setOrderType(type)} className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${orderType === type ? "bg-surface-container-lowest text-primary shadow-sm" : "text-secondary hover:text-on-surface font-semibold"}`} type="button">
                  <span className="material-symbols-outlined text-xs">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Customer Card */}
            <div className="bg-surface-container-low/60 rounded-xl p-2.5 flex items-center justify-between mb-4 border border-border-subtle/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface block leading-none">{customerName}</span>
                  <span className="text-[10px] font-semibold text-secondary mt-1 block">{customerName === "Walk-in Guest" ? "Non-member • Tanpa Piutang" : "Member • Eligible Diskon"}</span>
                </div>
              </div>
              <button onClick={() => setShowCustomerPicker(!showCustomerPicker)} className="text-primary text-[11px] font-bold hover:underline flex items-center gap-0.5" type="button">
                <span>Ubah</span>
                <span className="material-symbols-outlined text-[11px]">chevron_right</span>
              </button>
            </div>

            {/* CART LINE ITEMS */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="material-symbols-outlined text-3xl text-secondary">shopping_cart</span>
                  <p className="text-xs font-semibold text-secondary mt-2">Keranjang kosong</p>
                  <p className="text-[11px] text-secondary mt-0.5">Klik produk untuk menambahkan</p>
                </div>
              ) : cart.map(item => (
                <div key={item.product.id} className="p-3 bg-surface-container-low/40 rounded-xl flex flex-col gap-2 group hover:bg-surface-container-low transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="text-sm font-bold text-on-surface">{item.product.name}</div>
                      {item.variants.length > 0 && (
                        <div className="text-[11px] font-semibold text-secondary flex items-center gap-1 mt-1 flex-wrap">
                          {item.variants.map(v => (
                            <span key={v} className="px-1.5 py-0.5 bg-surface-container-lowest rounded text-on-surface shadow-sm border border-border-subtle/30">{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold tabular-nums text-on-surface block">{formatRupiah(item.product.price * item.qty)}</span>
                      <span className="text-[11px] text-secondary">@ {formatRupiah(item.product.price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button onClick={() => setEditingNoteId(editingNoteId === item.product.id ? null : item.product.id)} className={`text-[11px] font-semibold flex items-center gap-1 ${editingNoteId === item.product.id || item.notes ? 'text-primary' : 'text-secondary hover:text-primary'}`} type="button">
                      <span className="material-symbols-outlined text-[14px]">edit_note</span>
                      <span>Catatan</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.product.id, -1)} className="w-6 h-6 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center font-bold shadow-sm border border-border-subtle" type="button">-</button>
                      <span className="text-sm font-bold tabular-nums text-on-surface w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, 1)} className="w-6 h-6 rounded-lg bg-primary text-on-primary hover:bg-primary/90 flex items-center justify-center font-bold shadow-sm" type="button">+</button>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-secondary hover:text-status-danger transition-colors ml-1" type="button">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                  {/* Inline Note Editor */}
                  {editingNoteId === item.product.id && (
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-surface-container-lowest rounded-lg text-xs text-on-surface placeholder:text-secondary border border-border-subtle focus:outline-none focus:border-primary"
                      placeholder="Tambahkan catatan..."
                      value={item.notes}
                      onChange={(e) => updateNote(item.product.id, e.target.value)}
                      autoFocus
                    />
                  )}
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            {cart.length > 0 && (
              <>
                <div className="pt-4 mt-3 flex flex-col gap-2 border-t border-surface-container">
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="text-sm font-semibold tabular-nums text-on-surface">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-status-success font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sell</span>
                      <span>Diskon Promo [SENINHEMAT]</span>
                    </span>
                    <span className="text-sm font-bold tabular-nums">- {formatRupiah(discount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Pajak Resto PB1 (10%)</span>
                    <span className="text-sm font-semibold tabular-nums text-on-surface">{formatRupiah(tax)}</span>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-4 mt-2 flex items-center justify-between border border-primary/10">
                    <div>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Total Tagihan</span>
                      <span className="text-[32px] font-extrabold text-primary leading-none tracking-tight">{formatRupiah(grandTotal)}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-bold shadow-sm">Tax Incl.</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="mt-5">
                  <span className="text-[11px] font-bold text-secondary block mb-2 uppercase tracking-wider">Metode Pembayaran</span>
                  <div className="grid grid-cols-4 gap-2">
                    {([["qris", "qr_code_2", "QRIS"], ["tunai", "payments", "Tunai"], ["transfer", "credit_card", "Transfer"], ["kasbon", "receipt_long", "Kasbon"]] as const).map(([method, icon, label]) => (
                      <button
                        key={method}
                        onClick={() => { setPaymentMethod(method); setSelectedCash(null); }}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === method ? "bg-primary text-on-primary shadow-sm border border-primary/20" : "bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface"}`}
                        type="button"
                      >
                        <span className={`material-symbols-outlined text-[24px] ${paymentMethod === method ? "" : "text-secondary"}`}>{icon}</span>
                        <span className={`text-[11px] ${paymentMethod === method ? "font-bold" : "font-semibold"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUICK CASH OPTIONS (only for Tunai) */}
                {paymentMethod === "tunai" && (
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold text-secondary block mb-2">Pilihan Uang Pas Tunai:</span>
                    <div className="flex flex-wrap gap-2">
                      {cashOptions.map((amount, i) => (
                        <button
                          key={amount}
                          onClick={() => setSelectedCash(amount)}
                          className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold tabular-nums transition-colors shadow-sm ${selectedCash === amount ? "bg-primary text-on-primary" : "bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface"}`}
                          type="button"
                        >
                          {i === 0 ? `Uang Pas (${amount.toLocaleString("id-ID")})` : amount.toLocaleString("id-ID")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CHECKOUT ACTIONS */}
                <div className="mt-5 pt-4 flex flex-col gap-3 border-t border-surface-container">
                  <button onClick={() => setShowPayConfirm(true)} className="w-full py-4 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary text-[18px] font-bold shadow-lg shadow-primary/25 flex items-center justify-between active:scale-[0.99] transition-all" type="button">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[24px]">check_circle</span>
                      <span>Bayar & Cetak Struk</span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-on-primary/20 text-[12px] font-mono shadow-inner">F9</span>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { showSuccess("Pesanan ditahan sebagai draft"); }} className="py-3 rounded-xl bg-surface-container-lowest border border-border-subtle hover:bg-surface-container text-on-surface text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm" type="button">
                      <span className="material-symbols-outlined text-[18px] text-secondary">bookmark_border</span>
                      <span>Tahan / Simpan</span>
                    </button>
                    <button onClick={() => setShowCancelConfirm(true)} className="py-3 rounded-xl bg-status-danger-bg hover:bg-status-danger-bg/80 border border-status-danger/20 text-status-danger text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm" type="button">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                      <span>Batal Pesanan</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════ MODALS / CONFIRMATION DIALOGS ══════ */}

      {/* PAY CONFIRMATION */}
      {showPayConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPayConfirm(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-success-bg text-status-success flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-secondary mt-1">Metode: <strong className="text-on-surface capitalize">{paymentMethod}</strong></p>
              <div className="bg-primary/5 rounded-2xl p-4 mt-4 border border-primary/10">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">Total Bayar</span>
                <span className="text-3xl font-extrabold text-primary">{formatRupiah(grandTotal)}</span>
              </div>
              {paymentMethod === "tunai" && selectedCash && selectedCash > grandTotal && (
                <p className="text-sm font-bold text-status-success mt-3">Kembalian: {formatRupiah(selectedCash - grandTotal)}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowPayConfirm(false)} className="py-3 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface text-sm font-semibold hover:bg-surface-container transition-all" type="button" disabled={isSubmitting}>Batal</button>
              <button onClick={handlePay} className="py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50" type="button" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Batalkan Pesanan?</h3>
              <p className="text-sm text-secondary mt-1">Semua {totalItems} item akan dihapus dari keranjang. Aksi ini tidak bisa dibatalkan.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowCancelConfirm(false)} className="py-3 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface text-sm font-semibold hover:bg-surface-container transition-all" type="button">Kembali</button>
              <button onClick={clearCart} className="py-3 rounded-xl bg-status-danger text-white text-sm font-bold shadow-md hover:bg-status-danger/90 active:scale-[0.98] transition-all" type="button">Ya, Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {/* CASH DRAWER CONFIRMATION */}
      {showLaciConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLaciConfirm(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">inventory</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Buka Laci Kas?</h3>
              <p className="text-sm text-secondary mt-1">Laci kas akan dibuka secara manual. Pastikan ada alasan yang valid.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setShowLaciConfirm(false)} className="py-3 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface text-sm font-semibold hover:bg-surface-container transition-all" type="button">Batal</button>
              <button onClick={() => { setShowLaciConfirm(false); showSuccess("Laci kas berhasil dibuka"); }} className="py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all" type="button">Buka Laci</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
