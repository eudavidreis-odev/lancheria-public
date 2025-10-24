/**
 * @packageDocumentation
 * Implementação iOS do `IconSymbol` usando SF Symbols através de `expo-symbols`.
 * Centraliza o uso de símbolos nativos em dispositivos Apple.
 */
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Renderiza um símbolo nativo (SF Symbol) em iOS.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
