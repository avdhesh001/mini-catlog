import { selectSubtotal, selectDiscount, selectTotal } from './cartSlice';

test('selectors compute cart totals', () => {
  const state: any = {
    cart: {
      items: {
        p1: { id: 'p1', title: 'X', price: 50, quantity: 2 },
        p2: { id: 'p2', title: 'Y', price: 25, quantity: 1 },
      },
      promoCode: 'SAVE10',
    },
  };
  const subtotal = selectSubtotal(state);
  const discount = selectDiscount(state);
  const total = selectTotal(state);
  expect(subtotal).toBe(125);
  expect(discount).toBe(12.5);
  expect(total).toBe(112.5);
});
