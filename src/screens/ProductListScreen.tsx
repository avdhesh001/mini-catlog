import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { useProducts, Product } from '../api/products';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../features/products/favoritesSlice';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../i18n';

const ProductItem = React.memo(function ProductItem({
  item,
  isFavorite,
  onToggleFavorite,
  onPress,
}: {
  item: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      accessibilityLabel={item.title}
      style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
      onPress={() => onPress(item.id)}
    >
      <Image
        accessibilityLabel={item.title}
        source={{ uri: item.thumbnail }}
        style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1}>{item.title}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity accessibilityLabel="favorite" onPress={() => onToggleFavorite(item.id)}>
        <Text style={{ fontSize: 18 }}>{isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

export default function ProductListScreen() {
  const { data, isLoading, isFetching, refetch, error } = useProducts();
  const favorites = useSelector((s: RootState) => s.favorites.ids);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('products'),
      headerRight: () => (
        <TouchableOpacity onPress={() => toggleLanguage()} style={{ paddingHorizontal: 12 }}>
          <Text>{i18n.language === 'ar' ? t('english') : t('arabic')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t, i18n.language]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized derived data and handlers declared before conditional returns to keep hook order stable
  const filtered = useMemo(() => {
    const source = data || [];
    if (!query && !category) return source;
    const q = query.toLowerCase();
    return source.filter((p) => {
      const matchQuery = q ? p.title.toLowerCase().includes(q) : true;
      const matchCat = category ? p.category === category : true;
      return matchQuery && matchCat;
    });
  }, [data, query, category]);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      dispatch(toggleFavorite(id));
    },
    [dispatch],
  );

  const handlePressItem = useCallback(
    (id: string) => {
      navigation.navigate('ProductDetails', { id });
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('retry')}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductItem
        item={item}
        isFavorite={Boolean(favorites[item.id])}
        onToggleFavorite={handleToggleFavorite}
        onPress={handlePressItem}
      />
    ),
    [favorites, handleToggleFavorite, handlePressItem],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <FlatList
      data={filtered}
      keyExtractor={keyExtractor}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
      renderItem={renderItem}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews
      ListHeaderComponent={() => (
        <View style={{ padding: 12 }}>
          <TextInput
            placeholder={t('search') || 'Search'}
            value={query}
            onChangeText={setQuery}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 40,
            }}
          />
        </View>
      )}
      ListEmptyComponent={() => (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text>{t('empty_list')}</Text>
        </View>
      )}
    />
  );
}
