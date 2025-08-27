import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, applyPromo } from '../features/cart/cartSlice';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatAED } from '../utils/currency';

type PromoForm = { code: string };

const schema = yup.object({ code: yup.string().trim().required() });

export default function CartScreen() {
  const items = useSelector((s: RootState) => s.cart.items);
  const subtotal = useSelector((s: RootState) =>
    Object.values(s.cart.items).reduce((sum, it) => sum + it.price * it.quantity, 0),
  );
  const discount = useSelector((s: RootState) =>
    s.cart.promoCode?.toUpperCase() === 'SAVE10' ? subtotal * 0.1 : 0,
  );
  const total = subtotal - discount;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromoForm>({ resolver: yupResolver(schema) });

  React.useEffect(() => {
    register('code');
  }, [register]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={Object.values(items)}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 48, height: 48, borderRadius: 6, marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text>${item.price.toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                  }
                  style={{ paddingHorizontal: 8 }}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                  }
                  style={{ paddingHorizontal: 8 }}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeFromCart({ id: item.id }))}>
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text>Cart is empty</Text>
          </View>
        )}
      />
      <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#eee' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            accessibilityLabel={t('promo_placeholder')}
            placeholder={t('promo_placeholder')}
            onChangeText={(v) => setValue('code', v)}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: errors.code ? '#f66' : '#ddd',
              borderRadius: 8,
              paddingHorizontal: 12,
              height: 40,
            }}
          />
          <TouchableOpacity
            accessibilityLabel={t('apply')}
            onPress={handleSubmit(({ code }) => dispatch(applyPromo(code)))}
            style={{
              marginLeft: 8,
              paddingHorizontal: 12,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#111',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white' }}>{t('apply')}</Text>
          </TouchableOpacity>
        </View>
        <Text>
          {t('subtotal')}: {formatAED(subtotal, i18n.language === 'ar' ? 'ar' : 'en')}
        </Text>
        <Text>
          {t('discount')}: -{formatAED(discount, i18n.language === 'ar' ? 'ar' : 'en')}
        </Text>
        <Text style={{ fontWeight: 'bold' }}>
          {t('total')}: {formatAED(total, i18n.language === 'ar' ? 'ar' : 'en')}
        </Text>
      </View>
    </View>
  );
}
