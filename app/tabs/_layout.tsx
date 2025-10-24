/**
 * @packageDocumentation
 * Layout das tabs: define ícones, badges e comportamento da barra de navegação.
 */
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useCart } from '@/contexts/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text as RNText, View } from 'react-native';

/**
 * Componente que monta as Tabs principais e mostra badge de itens no carrinho.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const withBadge = (icon: React.ReactNode) => (
    <View>
      {icon}
      {count > 0 && (
        <View style={{ position: 'absolute', top: -2, right: -6, backgroundColor: 'tomato', borderRadius: 8, paddingHorizontal: 4, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
          <RNText style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{count}</RNText>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      {/* "orders" dentro de profile/orders; tela duplicada em tabs removida */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => withBadge(<IconSymbol size={28} name="cart.fill" color={color} />),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
