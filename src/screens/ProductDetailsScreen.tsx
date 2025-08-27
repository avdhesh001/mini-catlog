import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useProduct } from '../api/products';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { useTranslation } from 'react-i18next';
import { formatAED } from '../utils/currency';

export default function ProductDetailsScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const { data } = useProduct(id);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  if (!data) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {data.images.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={{ width: 320, height: 200, marginRight: 8, borderRadius: 8 }}
          />
        ))}
      </ScrollView>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>{data.title}</Text>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        {formatAED(data.price, i18n.language === 'ar' ? 'ar' : 'en')}
      </Text>
      <Text style={{ color: '#444' }}>{data.description}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
        <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: 8 }}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 12 }}>{qty}</Text>
        <TouchableOpacity onPress={() => setQty((q) => q + 1)} style={{ padding: 8 }}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: '#111', padding: 12, borderRadius: 8, alignItems: 'center' }}
        onPress={() =>
          dispatch(
            addToCart({
              id: data.id,
              title: data.title,
              price: data.price,
              thumbnail: data.thumbnail,
              quantity: qty,
            }),
          )
        }
      >
        <Text style={{ color: 'white' }}>{t('add_to_cart')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
