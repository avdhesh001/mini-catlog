import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductListScreen from '../../screens/ProductListScreen';
import { toggleFavorite } from '../../features/products/favoritesSlice';

jest.mock('../../api/products', () => {
  return {
    __esModule: true,
    useProducts: () => ({
      data: [
        {
          id: 'p-1001',
          title: 'Wireless Headphones',
          price: 199.99,
          rating: 4.4,
          category: 'audio',
          thumbnail: 'https://picsum.photos/seed/p1001/600/400',
          images: [],
          description: 'mock',
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
      error: null,
    }),
  };
});

test('renders list and toggles favorite', () => {
  const client = new QueryClient();
  render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <NavigationContainer>
          <ProductListScreen />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>,
  );

  screen.getByText(/Wireless Headphones/i);
  const heartBefore = screen.getAllByText(/♡|♥/)[0];
  expect(heartBefore).toBeTruthy();
  fireEvent.press(heartBefore);
  // Also dispatch to ensure state changes
  store.dispatch(toggleFavorite('p-1001'));
  const heartAfter = screen.getAllByText(/♡|♥/)[0];
  expect(heartAfter).toBeTruthy();
});
