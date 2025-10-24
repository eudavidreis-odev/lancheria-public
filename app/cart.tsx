import { useCart } from '@/contexts/CartContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export default function CartScreen() {
    const { items, total, updateQuantity, removeItem, clear } = useCart();
    const theme = useTheme();
    const router = useRouter();

    const renderItem = (item: typeof items[number]) => {
        const src = item.imageBase64 && item.imageMime
            ? { uri: `data:${item.imageMime};base64,${item.imageBase64}` }
            : undefined;
        return (
            <Card key={item.productId} style={{ marginBottom: 12 }}>
                <Card.Content style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    {src ? (
                        <Image source={src as any} style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant }} />
                    ) : (
                        <View style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ opacity: 0.6 }}>Sem imagem</Text>
                        </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text variant="titleMedium" style={{ fontWeight: '600' }}>{item.name}</Text>
                        <Text variant="bodySmall" style={{ opacity: 0.8 }}>Qtd: {item.quantity}</Text>
                        {!!item.observations && (
                            <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
                                Obs.: {item.observations}
                            </Text>
                        )}
                        <Text variant="titleSmall" style={{ marginTop: 4 }}>
                            {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                    <View style={{ gap: 6 }}>
                        <Button compact mode="outlined" onPress={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</Button>
                        <Button compact mode="outlined" onPress={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                        <Button compact mode="text" onPress={() => removeItem(item.productId)} color={theme.colors.error}>Remover</Button>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 16 }}>
                <Text variant="headlineSmall" style={{ marginBottom: 12, fontWeight: '700' }}>Carrinho de compras</Text>

                <View style={{ flex: 1 }}>
                    {items.length === 0 ? (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ opacity: 0.8 }}>Seu carrinho está vazio.</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
                            {items.map(renderItem)}
                        </ScrollView>
                    )}
                </View>

                <Card>
                    <Card.Content style={{ gap: 12 }}>
                        <Text variant="titleMedium">Total</Text>
                        <Text variant="headlineSmall">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                        {/* Ações empilhadas para evitar quebra em telas pequenas */}
                        <View style={{ gap: 8 }}>
                            <Button mode="contained" onPress={() => { /* Placeholder para checkout */ }} style={{ width: '100%' }}>
                                Finalizar compra
                            </Button>
                            <Button mode="outlined" onPress={() => router.back()} style={{ width: '100%' }}>
                                Continuar comprando
                            </Button>
                            <Button mode="text" onPress={clear} style={{ width: '100%' }}>
                                Limpar carrinho
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    );
}
