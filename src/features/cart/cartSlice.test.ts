import reducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromo,
  selectSubtotal,
  selectDiscount,
  selectTotal,
} from './cartSlice';

test('add, update, remove cart items and compute totals with promo', () => {
  let state = reducer(undefined, { type: 'init' } as any);
  state = reducer(state, addToCart({ id: 'p1', title: 'Item', price: 100 }));
  state = reducer(state, addToCart({ id: 'p1', title: 'Item', price: 100 }));
  state = reducer(state, updateQuantity({ id: 'p1', quantity: 3 }));
  expect(state.items['p1'].quantity).toBe(3);

  const subtotal = selectSubtotal({ cart: state } as any);
  expect(subtotal).toBe(300);

  state = reducer(state, applyPromo('SAVE10'));
  const discount = selectDiscount({ cart: state } as any);
  const total = selectTotal({ cart: state } as any);
  expect(discount).toBe(30);
  expect(total).toBe(270);

  state = reducer(state, removeFromCart({ id: 'p1' }));
  expect(state.items['p1']).toBeUndefined();
});
