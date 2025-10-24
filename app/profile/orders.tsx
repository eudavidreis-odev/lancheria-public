/**
 * @packageDocumentation
 * Tela de pedidos do usuário (placeholder informativo).
 */
import { layout } from '@/styles/layout';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

/**
 * Componente que mostra a tela "Meus pedidos" (atualmente informativa).
 */
export default function OrdersScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Meus pedidos' }} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: layout.screenPadding }}>
                <Text style={{ textAlign: 'center', opacity: 0.8 }}>
                    Em breve você poderá acompanhar aqui o histórico e status dos seus pedidos.
                </Text>
            </View>
        </>
    );
}
