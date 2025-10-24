import { isRNFirebaseAvailable } from '@/config/firebaseConfig';
import { Product, subscribeProducts } from '@/services/products';
import { layout } from '@/styles/layout';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { SectionList, View } from 'react-native';
import { Card, Text, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProductItem = Product;

export default function SearchScreen() {
    const router = useRouter();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [products, setProducts] = React.useState<ProductItem[]>([]);
    // estados de loading removidos; não há ações de escrita nesta tela
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        const unsub = subscribeProducts(setProducts);
        return () => unsub();
    }, []);

    // Botão de salvar imagens removido

    const renderItem = ({ item }: { item: ProductItem }) => {
        const src = item.imageBase64 && item.imageMime
            ? { uri: `data:${item.imageMime};base64,${item.imageBase64}` }
            : undefined;
        return (
            <Card mode="elevated" style={{ marginBottom: layout.gapMd }} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}>
                <Card.Content style={{ flexDirection: 'row', gap: layout.gapMd, alignItems: 'center' }}>
                    {src ? (
                        <Image
                            source={src as any}
                            style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant }}
                            contentFit="cover"
                        />
                    ) : (
                        <View style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ opacity: 0.6 }}>Sem imagem</Text>
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={{ fontWeight: '600' }}>{item.name}</Text>
                        <Text variant="bodySmall" style={{ opacity: 0.8 }} numberOfLines={2}>{item.description}</Text>
                        <Text variant="titleSmall" style={{ marginTop: 4 }}>
                            {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    const isDevBuild = isRNFirebaseAvailable() && Constants.appOwnership !== 'expo';
    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => p.name?.toLowerCase().includes(q));
    }, [products, query]);

    const deriveCategory = React.useCallback((p: Product): 'comida' | 'bebida' => {
        if (p.category === 'comida' || p.category === 'bebida') return p.category;
        const beverages = new Set(['refri_lata', 'refri_2l', 'suco_natural']);
        if (p.assetKey && beverages.has(p.assetKey)) return 'bebida';
        const n = (p.name ?? '').toLowerCase();
        if (n.includes('refri') || n.includes('refrigerante') || n.includes('suco') || n.includes('bebida')) return 'bebida';
        return 'comida';
    }, []);

    const sections = React.useMemo(() => {
        const comidas = filtered.filter((p) => deriveCategory(p) === 'comida');
        const bebidas = filtered.filter((p) => deriveCategory(p) === 'bebida');
        const list: Array<{ title: string; data: Product[] }> = [];
        if (comidas.length) list.push({ title: 'Comidas', data: comidas });
        if (bebidas.length) list.push({ title: 'Bebidas', data: bebidas });
        return list;
    }, [filtered, deriveCategory]);

    return (
        <View style={{ flex: 1, paddingHorizontal: layout.searchPadding, paddingBottom: layout.searchPadding, paddingTop: insets.top + layout.searchPadding }}>
            {/* Campo de busca por nome */}
            <TextInput
                mode="outlined"
                placeholder="Buscar por nome"
                left={<TextInput.Icon icon="magnify" />}
                value={query}
                onChangeText={setQuery}
                style={{ marginBottom: layout.gapMd }}
            />
            {/* Botão de salvar imagens removido */}

            {(!isDevBuild && products.length === 0) ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ opacity: 0.8, textAlign: 'center' }}>
                        Visualização de produtos requer um Development Build com Firebase configurado.
                    </Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderItem({ item })}
                    renderSectionHeader={({ section }) => (
                        <Text variant="titleMedium" style={{ marginTop: layout.gapMd, marginBottom: 6, fontWeight: '700' }}>
                            {section.title}
                        </Text>
                    )}
                    stickySectionHeadersEnabled={false}
                    contentContainerStyle={{ paddingBottom: layout.gapLg }}
                    ListEmptyComponent={
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 48 }}>
                            <Text style={{ opacity: 0.8 }}>Nenhum produto cadastrado.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
