/**
 * @packageDocumentation
 * Helpers para resolver cores de acordo com o tema atual (light/dark).
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Retorna uma cor apropriada para o tema atual. Primeiro tenta `props[theme]`,
 * depois usa a paleta padrão em `Colors`.
 *
 * @param props Objeto opcional com chaves `light` e `dark` para sobrescrever a cor.
 * @param colorName Nome da cor na paleta `Colors`.
 * @returns Valor de cor CSS/hex.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
