import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../store';
import CartScreen from '../../screens/CartScreen';
import { addToCart } from '../../features/cart/cartSlice';

test('add to cart and apply promo', () => {
  store.dispatch(addToCart({ id: 'p-1001', title: 'Wireless Headphones', price: 200 }));
  const { getByText, getByPlaceholderText } = render(
    <Provider store={store}>
      <CartScreen />
    </Provider>,
  );

  getByText(/Wireless Headphones/i);
  const input = getByPlaceholderText(/Promo code/i);
  fireEvent.changeText(input, 'SAVE10');
  fireEvent.press(getByText(/Apply/i));
  getByText(/Discount:/i);
});
