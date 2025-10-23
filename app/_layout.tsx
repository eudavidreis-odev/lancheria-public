import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
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
      <PaperProvider theme={colorScheme === 'dark' ? paperDarkTheme : paperLightTheme}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, initializing } = useAuth();

  // Pode-se mostrar um splash/loader aqui enquanto inicializa
  if (initializing) return null;

  if (!user) {
    // Sem usuário: exibe somente a tela de login como modal de tela cheia
    return (
      <Stack>
        <Stack.Screen
          name="auth/login"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
      </Stack>
    );
  }

  // Autenticado: exibe Tabs e demais rotas
  return (
    <Stack>
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}
