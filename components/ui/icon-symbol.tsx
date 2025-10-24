/**
 * @packageDocumentation
 * Componente de ícone multiplataforma. Usa SF Symbols no iOS e MaterialIcons
 * no Android/web como fallback. Mapeamentos para ícones podem ser ajustados em
 * `MAPPING`.
 */
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // Tabs atuais
  'magnifyingglass': 'search',
  'cart.fill': 'shopping-cart',
  'person.crop.circle': 'account-circle',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
/**
 * Props for the `IconSymbol` component.
 *
 * - `name` follows the SF Symbols naming. When running on Android/web the
 *   name will be mapped to a Material Icon via the `MAPPING` table.
 */
export type IconSymbolProps = {
  /** SF Symbol name (e.g. `"house.fill"`, `"magnifyingglass"`). */
  name: SymbolViewProps['name'];
  /** Icon size in pixels. Defaults to 24. */
  size?: number;
  /** Icon color. Can be a string or an OpaqueColorValue (native). */
  color?: string | OpaqueColorValue;
  /** Optional style forwarded to the underlying icon component. */
  style?: StyleProp<TextStyle>;
  /** Weight for SF Symbols (kept for parity if needed). */
  weight?: SymbolWeight;
};

/**
 * Cross-platform icon component.
 *
 * On iOS this project prefers native SF Symbols. On Android and web we
 * render a visually-similar icon from Material Icons using the `MAPPING`
 * table above. If no mapping exists the component falls back to
 * `help-outline`.
 *
 * @remarks
 * Keep `MAPPING` updated when you introduce new SF Symbols that must
 * appear on non-iOS platforms. Prefer SF Symbols names for the `name`
 * prop across the codebase so designers/developers can reference a
 * single canonical identifier.
 *
 * @example
 * <IconSymbol name="cart.fill" color="#fff" size={20} />
 */
export function IconSymbol(props: IconSymbolProps) {
  const { name, size = 24, color, style } = props;
  const mapped = (MAPPING as Record<string, ComponentProps<typeof MaterialIcons>['name']>)[
    name as string
  ] ?? 'help-outline';

  return <MaterialIcons color={color} size={size} name={mapped} style={style} />;
}
