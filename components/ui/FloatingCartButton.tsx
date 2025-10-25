/**
 * @packageDocumentation
 * Botão flutuante de carrinho com badge e suporte a arraste (movível).
 *
 * - Posicionado por padrão via `top` e `right` (absoluto) e pode ser movido pelo usuário.
 * - Quando movido, persiste a posição (se `persistKey` for informado) usando `AsyncStorage`.
 * - Para acionar a ação (onPress), toque rápido sem arrastar significativamente.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import { Badge, IconButton } from 'react-native-paper';

export type FloatingCartButtonProps = {
    /** Offset inicial do topo (px). Geralmente `insets.top + 96` (ou subtraindo headerHeight). */
    top: number;
    /** Offset inicial da direita (px). Geralmente `16`. */
    right: number;
    /** Quantidade total do carrinho para exibir no badge. */
    count: number;
    /** Ação ao tocar no botão (toque leve, sem arrastar). */
    onPress: () => void;
    /** Chave para persistir posição entre telas/sessões. Se omitido, não persiste. */
    persistKey?: string;
};

type PersistedPos = { left: number; top: number };

export function FloatingCartButton({ top, right, count, onPress, persistKey }: FloatingCartButtonProps) {
    const window = Dimensions.get('window');
    const [btnSize, setBtnSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [basePos, setBasePos] = React.useState<{ left: number; top: number }>({ left: 0, top: top });
    const translate = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const startTouch = React.useRef<{ x: number; y: number } | null>(null);

    // Carrega posição persistida (se houver)
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            if (!persistKey) return;
            try {
                const raw = await AsyncStorage.getItem(persistKey);
                if (raw && mounted) {
                    const p: PersistedPos = JSON.parse(raw);
                    setBasePos({ left: p.left, top: p.top });
                    translate.setValue({ x: 0, y: 0 });
                }
            } catch { }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [persistKey]);

    // Quando tamanho do botão for conhecido pela primeira vez, calcula base a partir de right
    React.useEffect(() => {
        if (btnSize.w > 0) {
            const left = Math.max(0, window.width - right - btnSize.w);
            setBasePos((prev) => ({ left: prev.left || left, top }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [btnSize.w, top, right, window.width]);

    const savePosition = async (absLeft: number, absTop: number) => {
        if (!persistKey) return;
        try {
            await AsyncStorage.setItem(persistKey, JSON.stringify({ left: absLeft, top: absTop } satisfies PersistedPos));
        } catch { }
    };

    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    startTouch.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
                    translate.setOffset({ x: (translate as any).x._value, y: (translate as any).y._value });
                    translate.setValue({ x: 0, y: 0 });
                },
                onPanResponderMove: Animated.event([null, { dx: translate.x, dy: translate.y }], { useNativeDriver: false }),
                onPanResponderRelease: (evt) => {
                    translate.flattenOffset();
                    const totalX = (translate as any).x._value;
                    const totalY = (translate as any).y._value;

                    // Determina se foi clique (movimento pequeno)
                    const st = startTouch.current;
                    const movedEnough = st
                        ? Math.abs(evt.nativeEvent.pageX - st.x) + Math.abs(evt.nativeEvent.pageY - st.y) > 8
                        : Math.abs(totalX) + Math.abs(totalY) > 8;

                    const absLeft = basePos.left + totalX;
                    const absTop = basePos.top + totalY;

                    // Limita aos limites da tela
                    const clampedLeft = Math.min(Math.max(0, absLeft), Math.max(0, window.width - btnSize.w));
                    const clampedTop = Math.min(Math.max(0, absTop), Math.max(0, window.height - btnSize.h));

                    // Reposiciona base e zera translate
                    setBasePos({ left: clampedLeft, top: clampedTop });
                    translate.setValue({ x: 0, y: 0 });

                    // Persiste
                    savePosition(clampedLeft, clampedTop);

                    // Clique se não arrastou de verdade
                    if (!movedEnough) {
                        onPress();
                    }
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [basePos.left, basePos.top, btnSize.w, btnSize.h, onPress]
    );

    return (
        <View
            // Wrapper absoluto na posição base calculada
            style={{ position: 'absolute', left: basePos.left, top: basePos.top, zIndex: 10 }}
            // Captura tamanho para cálculo de left inicial
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                if (width !== btnSize.w || height !== btnSize.h) setBtnSize({ w: width, h: height });
            }}
            // PanResponder no wrapper
            {...panResponder.panHandlers}
        >
            <Animated.View style={{ transform: [{ translateX: translate.x }, { translateY: translate.y }] }}>
                <View style={{ position: 'relative' }}>
                    <IconButton
                        icon="cart"
                        size={28}
                        mode="contained"
                        accessibilityLabel="Abrir carrinho"
                        // sombra / elevação
                        style={{ elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } }}
                    />
                    {count > 0 && (
                        <Badge style={{ position: 'absolute', top: -4, right: -4 }} size={18}>
                            {count}
                        </Badge>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

export default FloatingCartButton;
