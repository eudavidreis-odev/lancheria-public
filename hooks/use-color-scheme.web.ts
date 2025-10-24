import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * @packageDocumentation
 * Hook para web que garante que o valor de `useColorScheme` seja calculado apenas
 * após a hidratação do cliente (evita discrepâncias durante SSR/SSG).
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
