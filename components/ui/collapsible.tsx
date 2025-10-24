/**
 * Componente colapsável simples com título e conteúdo.
 * Alterna a visibilidade ao toque no cabeçalho.
 */
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Propriedades do componente `Collapsible`.
 */
export type CollapsibleProps = PropsWithChildren<{
  /** Título exibido no cabeçalho clicável. */
  title: string;
}>;

/**
 * Renderiza um bloco colapsável com cabeçalho e conteúdo.
 *
 * - Ao tocar no cabeçalho, alterna a visibilidade do conteúdo.
 * - Usa `IconSymbol` com rotação para indicar estado aberto/fechado.
 *
 * @example
 * <Collapsible title="Detalhes">
 *   <ThemedText>Conteúdo interno</ThemedText>
 * </Collapsible>
 */
export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
