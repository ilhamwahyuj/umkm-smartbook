// src/stores/usePurchaseStore.ts
import { create } from "zustand";
import type { Supplier, Product, ProductVariant } from "@/types/database";

export interface PurchaseCartItem {
  product: Product;
  variant?: ProductVariant;
  qty: number;
  unit_price: number;
  subtotal: number;
}

export interface PurchaseState {
  items: PurchaseCartItem[];
  supplier: Supplier | null;
  discount_amount: number;
  tax_amount: number;
  payment_method: string;
  payment_status: "paid" | "partial" | "unpaid";
  paid_amount: number;
  notes: string;
}

interface PurchaseStore extends PurchaseState {
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  updatePrice: (productId: string, variantId: string | undefined, unit_price: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  setSupplier: (supplier: Supplier | null) => void;
  setDiscount: (amount: number) => void;
  setTax: (amount: number) => void;
  setPaymentMethod: (method: string) => void;
  setPaymentStatus: (status: "paid" | "partial" | "unpaid") => void;
  setPaidAmount: (amount: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  // Computed
  subtotal: () => number;
  grandTotal: () => number;
}

const defaultState: PurchaseState = {
  items: [],
  supplier: null,
  discount_amount: 0,
  tax_amount: 0,
  payment_method: "transfer",
  payment_status: "paid",
  paid_amount: 0,
  notes: "",
};

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  ...defaultState,

  addItem: (product, variant, qty = 1) => {
    const { items } = get();
    const key = variant ? variant.id : product.id;
    const existingIdx = items.findIndex(
      (i) => (variant ? i.variant?.id === key : i.product.id === key && !i.variant)
    );

    if (existingIdx >= 0) {
      const updated = [...items];
      const item = updated[existingIdx];
      const newQty = item.qty + qty;
      updated[existingIdx] = {
        ...item,
        qty: newQty,
        subtotal: newQty * item.unit_price,
      };
      set({ items: updated });
    } else {
      // Default price is buy_price for purchases
      const unitPrice = variant ? variant.buy_price : product.buy_price;
      const newItem: PurchaseCartItem = {
        product,
        variant,
        qty,
        unit_price: unitPrice,
        subtotal: qty * unitPrice,
      };
      set({ items: [...items, newItem] });
    }
  },

  updateQty: (productId, variantId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId, variantId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => {
        const match = variantId
          ? item.variant?.id === variantId
          : item.product.id === productId && !item.variant;
        if (!match) return item;
        return { ...item, qty, subtotal: qty * item.unit_price };
      }),
    }));
  },

  updatePrice: (productId, variantId, unit_price) => {
    if (unit_price < 0) return;
    set((state) => ({
      items: state.items.map((item) => {
        const match = variantId
          ? item.variant?.id === variantId
          : item.product.id === productId && !item.variant;
        if (!match) return item;
        return { ...item, unit_price, subtotal: item.qty * unit_price };
      }),
    }));
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
      items: state.items.filter((item) => {
        if (variantId) return item.variant?.id !== variantId;
        return !(item.product.id === productId && !item.variant);
      }),
    }));
  },

  setSupplier: (supplier) => set({ supplier }),
  setDiscount: (discount_amount) => set({ discount_amount }),
  setTax: (tax_amount) => set({ tax_amount }),
  setPaymentMethod: (payment_method) => set({ payment_method }),
  setPaymentStatus: (payment_status) => set({ payment_status }),
  setPaidAmount: (paid_amount) => set({ paid_amount }),
  setNotes: (notes) => set({ notes }),

  clearCart: () => set(defaultState),

  subtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),

  grandTotal: () => {
    return get().subtotal() - get().discount_amount + get().tax_amount;
  },
}));
