import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import productsData from '../../data/products.json';

export type Product = {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
};

const PRODUCTS_CACHE_KEY = 'cache_products_v1';

async function fetchProducts(): Promise<Product[]> {
  // Simulate network fetch; replace with real axios/json-server if needed
  return new Promise((resolve) => setTimeout(() => resolve(productsData as Product[]), 300));
}

async function fetchProductById(id: string): Promise<Product | undefined> {
  const items = (productsData as Product[]) || [];
  return new Promise((resolve) => setTimeout(() => resolve(items.find((p) => p.id === id)), 200));
}

export function useProducts() {
  const queryClient = useQueryClient();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await fetchProducts();
        await AsyncStorage.setItem(
          PRODUCTS_CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data }),
        );
        return data;
      } catch (e) {
        const cached = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return parsed.data as Product[];
        }
        throw e;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function useProduct(productId: string) {
  return useQuery<Product | undefined>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: Boolean(productId),
  });
}
