// src/stores/useCartStore.ts
import { create } from "zustand";
import type { CartItem, CartState, Customer, Product, ProductVariant } from "@/types/database";

interface CartStore extends CartState {
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  setCustomer: (customer: Customer | null) => void;
  setDiscount: (discountAmount: number, discountPercent: number) => void;
  setTaxPercent: (taxPercent: number) => void;
  setPaymentMethod: (method: string) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  // Computed
  subtotal: () => number;
  discountTotal: () => number;
  taxTotal: () => number;
  grandTotal: () => number;
}

const defaultState: CartState = {
  items: [],
  customer: null,
  discount_amount: 0,
  discount_percent: 0,
  tax_percent: 0,
  payment_method: "cash",
  notes: "",
};

export const useCartStore = create<CartStore>((set, get) => ({
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
        subtotal: newQty * item.unit_price - item.discount_amount,
      };
      set({ items: updated });
    } else {
      const unitPrice = variant ? variant.sell_price : product.sell_price;
      const newItem: CartItem = {
        product,
        variant,
        qty,
        unit_price: unitPrice,
        discount_amount: 0,
        discount_percent: 0,
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
        return { ...item, qty, subtotal: qty * item.unit_price - item.discount_amount };
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

  setCustomer: (customer) => set({ customer }),
  setDiscount: (discount_amount, discount_percent) => set({ discount_amount, discount_percent }),
  setTaxPercent: (tax_percent) => set({ tax_percent }),
  setPaymentMethod: (payment_method) => set({ payment_method }),
  setNotes: (notes) => set({ notes }),

  clearCart: () => set(defaultState),

  subtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),

  discountTotal: () => {
    const { discount_amount, discount_percent } = get();
    const sub = get().subtotal();
    return discount_amount + (sub * discount_percent) / 100;
  },

  taxTotal: () => {
    const { tax_percent } = get();
    const sub = get().subtotal() - get().discountTotal();
    return (sub * tax_percent) / 100;
  },

  grandTotal: () => {
    return get().subtotal() - get().discountTotal() + get().taxTotal();
  },
}));
