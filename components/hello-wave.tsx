/**
 * @packageDocumentation
 * Pequeno componente visual que exibe um emoji com leve animação (usado como saudação).
 */
import Animated from 'react-native-reanimated';

/** Renderiza um "wave" animado com emoji. */
export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
