import React from 'react';
import { View } from 'react-native';

export default function Skeleton({ width = '100%', height = 16, style = {} as any }) {
  return <View style={[{ backgroundColor: '#eee', width, height, borderRadius: 8 }, style]} />;
}
