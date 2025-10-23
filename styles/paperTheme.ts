import { darkTheme, lightTheme } from '@/styles/theme';
import type { MD3Theme } from 'react-native-paper';
import { MD3DarkTheme as DefaultDarkTheme, MD3LightTheme as DefaultLightTheme } from 'react-native-paper';

export const paperLightTheme: MD3Theme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        primary: lightTheme.colors.primary,
        secondary: lightTheme.colors.secondary,
        surface: lightTheme.colors.surface,
        background: lightTheme.colors.background,
        error: lightTheme.colors.danger,
    },
};

export const paperDarkTheme: MD3Theme = {
    ...DefaultDarkTheme,
    colors: {
        ...DefaultDarkTheme.colors,
        primary: darkTheme.colors.primary,
        secondary: darkTheme.colors.secondary,
        surface: darkTheme.colors.surface,
        background: darkTheme.colors.background,
        error: darkTheme.colors.danger,
    },
};
