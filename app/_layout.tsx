import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { paperDarkTheme, paperLightTheme } from '@/styles/paperTheme';
import { Provider as PaperProvider } from 'react-native-paper';

export const unstable_settings = {
  anchor: 'tabs',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CartProvider>
        <PaperProvider theme={colorScheme === 'dark' ? paperDarkTheme : paperLightTheme}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { initializing } = useAuth();

  // Pode-se mostrar um splash/loader aqui enquanto inicializa
  if (initializing) return null;

  // Exibe sempre as Tabs; telas internas decidem layout com base em user
  return (
    <Stack>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      {/* Rota de login permanece disponível para uso opcional como modal */}
      <Stack.Screen
        name="auth/login"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}
