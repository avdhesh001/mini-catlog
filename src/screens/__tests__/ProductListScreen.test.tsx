import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '../../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductListScreen from '../../screens/ProductListScreen';

test('renders list and toggles favorite', async () => {
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

  await waitFor(() => screen.getByText(/Wireless Headphones/i));
  const heartButtons = screen.getAllByText(/♡|♥/);
  fireEvent.press(heartButtons[0]);
});
