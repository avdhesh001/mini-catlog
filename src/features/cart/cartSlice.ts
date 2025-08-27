import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
  quantity: number;
};

export type CartState = {
  items: Record<string, CartItem>;
  promoCode: string | null;
};

const initialState: CartState = {
  items: {},
  promoCode: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        price: number;
        thumbnail?: string;
        quantity?: number;
      }>,
    ) => {
      const { id, title, price, thumbnail, quantity = 1 } = action.payload;
      const existing = state.items[id];
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items[id] = { id, title, price, thumbnail, quantity };
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      delete state.items[action.payload.id];
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items[action.payload.id];
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    applyPromo: (state, action: PayloadAction<string | null>) => {
      state.promoCode = action.payload;
    },
    clearCart: (state) => {
      state.items = {};
      state.promoCode = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, applyPromo, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectItems = (state: { cart: CartState }) => state.cart.items;
export const selectPromo = (state: { cart: CartState }) => state.cart.promoCode;

export const selectSubtotal = createSelector([selectItems], (items) =>
  Object.values(items).reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectDiscount = createSelector([selectSubtotal, selectPromo], (subtotal, promo) => {
  if (!promo) return 0;
  if (promo.toUpperCase() === 'SAVE10') return subtotal * 0.1;
  return 0;
});

export const selectTotal = createSelector([selectSubtotal, selectDiscount], (subtotal, discount) =>
  Math.max(0, subtotal - discount),
);
