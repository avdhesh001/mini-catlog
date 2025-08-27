import React, { useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useProducts, Product } from '../api/products';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../features/products/favoritesSlice';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { toggleLanguage } from '../i18n';

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

  const filtered = (data || []).filter((p) => {
    const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const matchCat = category ? p.category === category : true;
    return matchQuery && matchCat;
  });

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
      renderItem={({ item }: { item: Product }) => (
        <TouchableOpacity
          accessibilityLabel={item.title}
          style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}
          onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
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
          <TouchableOpacity
            accessibilityLabel="favorite"
            onPress={() => dispatch(toggleFavorite(item.id))}
          >
            <Text style={{ fontSize: 18 }}>{favorites[item.id] ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
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
