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
import { Badge, IconButton, Portal } from 'react-native-paper';

export type FloatingCartButtonProps = {
    /** Offset absoluto alvo do topo (px) ao ancorar em TOP. Idealmente visibleTop + marginTop. */
    top: number;
    /** Offset de margem da direita (px) ao ancorar em RIGHT. Ex.: 16. */
    right: number;
    /** Quantidade total do carrinho para exibir no badge. */
    count: number;
    /** Ação ao tocar no botão (toque leve, sem arrastar). */
    onPress: () => void;
    /** Chave para persistir posição entre telas/sessões. Se omitido, não persiste. */
    persistKey?: string;
    /** Topo visível do conteúdo (safe-area + header, se existir). Ex.: insets.top ou insets.top + headerHeight. */
    visibleTop: number;
    /** Insets seguros da tela (safe-area). */
    insets: { top: number; bottom: number; left: number; right: number };
    /**
     * Modo de ancoragem vertical do FAB:
     * - 'screen' (padrão): relativo ao topo físico da tela (safe-area), ignora header.
     * - 'content': relativo ao topo visível do conteúdo (safe-area + header, etc.).
     */
    anchorMode?: 'screen' | 'content';
    /** Quando true, monta o FAB dentro de um Portal para ancorar à janela inteira. */
    usePortal?: boolean;
};

type PersistedState = { corner: 'tl' | 'tr' | 'bl' | 'br' };

export function FloatingCartButton({ top, right, count, onPress, persistKey, visibleTop, insets, anchorMode = 'screen', usePortal = true }: FloatingCartButtonProps) {
    const window = Dimensions.get('window');
    const [btnSize, setBtnSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [basePos, setBasePos] = React.useState<{ left: number; top: number }>({ left: 0, top });
    const translate = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const startTouch = React.useRef<{ x: number; y: number } | null>(null);
    // Helper para obter o topo de referência conforme ancoragem
    const getTopEdgeBase = React.useCallback(() => (anchorMode === 'screen' ? insets.top : visibleTop), [anchorMode, insets.top, visibleTop]);
    // Margens desejadas relativamente às bordas: topMargin = top - topEdgeBase; rightMargin = right
    const topMarginRef = React.useRef<number>(0);
    const rightMarginRef = React.useRef<number>(Math.max(0, right));
    const defaultCorner: PersistedState['corner'] = 'tr';

    // Carrega posição persistida (se houver) e aplica com margens atuais/visíveis
    React.useEffect(() => {
        topMarginRef.current = Math.max(0, top - getTopEdgeBase());
    }, [top, getTopEdgeBase]);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            if (!persistKey) return;
            try {
                const raw = await AsyncStorage.getItem(persistKey);
                if (raw && mounted) {
                    const p: PersistedState = JSON.parse(raw);
                    const applied = computeCornerPosition(p.corner);
                    setBasePos(applied);
                    translate.setValue({ x: 0, y: 0 });
                }
            } catch { }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [persistKey, btnSize.w, btnSize.h, visibleTop, insets.top, insets.right, insets.bottom, window.width, window.height, anchorMode]);

    // Quando tamanho do botão for conhecido, calcula base padrão (top-right) se ainda não houver posição
    React.useEffect(() => {
        if (btnSize.w > 0) {
            const left = Math.max(0, window.width - insets.right - rightMarginRef.current - btnSize.w);
            const topEdgeBase = getTopEdgeBase();
            setBasePos((prev) => ({ left: prev.left || left, top: prev.top || topEdgeBase + topMarginRef.current }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [btnSize.w, visibleTop, insets.right, window.width, getTopEdgeBase]);

    const savePosition = async (corner: PersistedState['corner']) => {
        if (!persistKey) return;
        try {
            await AsyncStorage.setItem(persistKey, JSON.stringify({ corner } satisfies PersistedState));
        } catch { }
    };

    // Dada a corner, calcula posição absoluta usando margens e zonas seguras
    function computeCornerPosition(corner: PersistedState['corner']): { left: number; top: number } {
        const leftEdge = insets.left;
        const rightEdge = window.width - insets.right - btnSize.w;
        const topEdge = getTopEdgeBase();
        const bottomEdge = window.height - insets.bottom - btnSize.h;
        const marginV = topMarginRef.current;
        const marginH = rightMarginRef.current;
        switch (corner) {
            case 'tl':
                return { left: leftEdge + marginH, top: topEdge + marginV };
            case 'tr':
                return { left: rightEdge - marginH, top: topEdge + marginV };
            case 'bl':
                return { left: leftEdge + marginH, top: bottomEdge - marginV };
            case 'br':
            default:
                return { left: rightEdge - marginH, top: bottomEdge - marginV };
        }
    }

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

                    // Clique: não anima snap, apenas executa ação e volta para base
                    if (!movedEnough) {
                        Animated.spring(translate, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: false,
                            damping: 20,
                            stiffness: 200,
                            mass: 1,
                            overshootClamping: true,
                        }).start();
                        onPress();
                        return;
                    }

                    const absLeft = basePos.left + totalX;
                    const absTop = basePos.top + totalY;

                    // Edges visuais considerando safe-area e header
                    const leftEdge = insets.left;
                    const rightEdge = window.width - insets.right - btnSize.w;
                    const topEdge = getTopEdgeBase();
                    const bottomEdge = window.height - insets.bottom - btnSize.h;

                    // Candidatos de cantos com margens fixas
                    const marginV = topMarginRef.current;
                    const marginH = rightMarginRef.current;
                    const corners = {
                        tl: { left: leftEdge + marginH, top: topEdge + marginV },
                        tr: { left: rightEdge - marginH, top: topEdge + marginV },
                        bl: { left: leftEdge + marginH, top: bottomEdge - marginV },
                        br: { left: rightEdge - marginH, top: bottomEdge - marginV },
                    } as const;

                    // Escolhe canto mais próximo pela distância euclidiana; empates preferem direita e topo
                    type K = keyof typeof corners;
                    const dist = (p: { left: number; top: number }) => {
                        const dx = absLeft - p.left;
                        const dy = absTop - p.top;
                        return Math.hypot(dx, dy);
                    };
                    const entries = Object.entries(corners) as Array<[K, { left: number; top: number }]>;
                    entries.sort((a, b) => {
                        const da = dist(a[1]);
                        const db = dist(b[1]);
                        if (da === db) {
                            // preferir direita (tr/br) e depois topo (tr/tl)
                            const pref = (k: K) => (k.endsWith('r') ? 0 : 1) + (k.startsWith('t') ? 0 : 2);
                            return pref(a[0]) - pref(b[0]);
                        }
                        return da - db;
                    });
                    const chosen: K = entries[0][0];
                    const pos = corners[chosen];

                    // Anima suavemente até o canto escolhido
                    const targetX = pos.left - basePos.left;
                    const targetY = pos.top - basePos.top;
                    Animated.spring(translate, {
                        toValue: { x: targetX, y: targetY },
                        useNativeDriver: false,
                        damping: 20,
                        stiffness: 200,
                        mass: 1,
                        overshootClamping: true,
                    }).start(() => {
                        // Após animação, fixa base e zera translate
                        setBasePos({ left: pos.left, top: pos.top });
                        translate.setValue({ x: 0, y: 0 });
                    });

                    // Persiste canto
                    savePosition(chosen);

                    // Clique já tratado acima quando !movedEnough
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [basePos.left, basePos.top, btnSize.w, btnSize.h, onPress]
    );

    const content = (
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
                        style={{ elevation: 6, margin: 0, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } }}
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
    if (usePortal) {
        return <Portal>{content}</Portal>;
    }
    return content;
}

export default FloatingCartButton;
