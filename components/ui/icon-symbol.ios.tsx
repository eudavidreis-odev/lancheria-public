/**
 * @packageDocumentation
 * Implementação iOS do `IconSymbol` usando SF Symbols através de `expo-symbols`.
 * Centraliza o uso de símbolos nativos em dispositivos Apple.
 */
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Renderiza um símbolo nativo (SF Symbol) em iOS.
 * @param props.name Nome do símbolo (conforme `expo-symbols`).
 * @param props.size Tamanho em pixels (largura/altura).
 * @param props.color Cor do símbolo.
 * @param props.style Estilo adicional para o componente.
 * @param props.weight Peso do símbolo (quando suportado).
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
