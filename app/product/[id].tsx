/**
 * @packageDocumentation
 * Tela de detalhe de produto. Permite ajustar quantidade, adicionar observações e
 * incluir o produto no carrinho via `CartContext`.
 */
import { useCart } from '@/contexts/CartContext';
import { getProductById, Product } from '@/services/products';
import { layout } from '@/styles/layout';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Badge, Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Componente de detalhe do produto identificado por `id` na rota.
 */
export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();
    const { addItem, items } = useCart();
    const insets = useSafeAreaInsets();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [qty, setQty] = React.useState('1');
    const [notes, setNotes] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const p = id ? await getProductById(String(id)) : null;
            if (mounted) {
                setProduct(p);
                setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const quantity = Math.max(1, parseInt(qty || '1', 10) || 1);

    if (loading) return (
        <>
            <Stack.Screen options={{ title: '' }} />
        </>
    );
    if (!product) {
        return (
            <>
                <Stack.Screen options={{ title: '' }} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: layout.screenPadding }}>
                    <Text>Produto não encontrado.</Text>
                </View>
            </>
        );
    }

    const src = product.imageBase64 && product.imageMime
        ? { uri: `data:${product.imageMime};base64,${product.imageBase64}` }
        : undefined;

    const totalItems = React.useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    const addToCart = () => {
        const wasEmpty = totalItems === 0;
        addItem(product, quantity, notes.trim() || undefined);
        if (wasEmpty) {
            router.replace('/tabs/cart');
        }
    };

    // Deriva categoria para título do header
    const deriveCategory = React.useCallback((p: Product): 'comida' | 'bebida' => {
        if (p.category === 'comida' || p.category === 'bebida') return p.category;
        const beverages = new Set(['refri_lata', 'refri_2l', 'suco_natural']);
        if (p.assetKey && beverages.has(p.assetKey)) return 'bebida';
        const n = (p.name ?? '').toLowerCase();
        if (n.includes('refri') || n.includes('refrigerante') || n.includes('suco') || n.includes('bebida')) return 'bebida';
        return 'comida';
    }, []);
    const categoryLabel = deriveCategory(product) === 'bebida' ? 'Bebidas' : 'Comidas';

    return (
        <View style={{ flex: 1, padding: layout.screenPadding }}>
            <Stack.Screen options={{ title: `${categoryLabel}/${product.name}` }} />
            {totalItems > 0 && (
                <View style={{ position: 'absolute', top: insets.top + 96, right: 16, zIndex: 10 }}>
                    <View style={{ position: 'relative' }}>
                        <IconButton
                            icon="cart"
                            size={28}
                            mode="contained"
                            onPress={() => router.push('/tabs/cart')}
                            accessibilityLabel="Abrir carrinho"
                            style={{ elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } }}
                        />
                        <Badge
                            style={{ position: 'absolute', top: -4, right: -4 }}
                            size={18}
                        >
                            {totalItems}
                        </Badge>
                    </View>
                </View>
            )}
            <Card mode="elevated" style={{ marginBottom: layout.gapLg }}>
                <Card.Content>
                    {src ? (
                        <Image source={src as any} style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant }} contentFit="cover" />
                    ) : (
                        <View style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ opacity: 0.6 }}>Sem imagem</Text>
                        </View>
                    )}
                    <Text variant="titleLarge" style={{ marginTop: layout.gapMd, fontWeight: '700' }}>{product.name}</Text>
                    <Text variant="bodyMedium" style={{ marginTop: 4, opacity: 0.8 }}>{product.description}</Text>
                    <Text variant="titleMedium" style={{ marginTop: 8 }}>
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                </Card.Content>
            </Card>

            <Card>
                <Card.Content style={{ gap: layout.gapMd }}>
                    <Text variant="titleMedium">Quantidade</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: layout.gapMd }}>
                        <Button mode="outlined" onPress={() => setQty(String(Math.max(1, quantity - 1)))}>-</Button>
                        <TextInput mode="outlined" value={String(quantity)} onChangeText={setQty} style={{ width: 80, textAlign: 'center' }} keyboardType="number-pad" />
                        <Button mode="outlined" onPress={() => setQty(String(quantity + 1))}>+</Button>
                    </View>
                    <Text variant="titleMedium">Observações</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Ex.: tirar cebola, maionese à parte ..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                    <Button mode="contained" onPress={addToCart}>
                        Adicionar ao carrinho
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}
