import { getAuth, getAuthInstance, isRNFirebaseAvailable } from '@/config/firebaseConfig';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const theme = useTheme();
    const [loading, setLoading] = useState<'google' | 'guest' | null>(null);
    const googleConfig = (Constants?.expoConfig?.extra as any)?.googleAuth ?? {};

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId: googleConfig.iosClientId,
        androidClientId: googleConfig.androidClientId,
        webClientId: googleConfig.webClientId,
        redirectUri: makeRedirectUri({ scheme: (Constants?.expoConfig as any)?.scheme || 'lancheria' }),
    });

    useEffect(() => {
        const completeGoogleSignIn = async () => {
            if (response?.type !== 'success') return;
            const idToken = (response.params as any).id_token as string | undefined;
            if (!idToken) return;
            if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
                Alert.alert('Requer Development Build', 'Login com Google requer um Development Build (não funciona no Expo Go).');
                setLoading(null);
                return;
            }
            try {
                setLoading('google');
                const RNAuth = getAuth();
                const googleCredential = RNAuth.GoogleAuthProvider.credential(idToken);
                await RNAuth().signInWithCredential(googleCredential);
            } catch (e: any) {
                Alert.alert('Falha ao entrar com Google', e?.message ?? String(e));
            } finally {
                setLoading(null);
            }
        };
        completeGoogleSignIn();
    }, [response]);

    const onGooglePress = async () => {
        try {
            setLoading('google');
            await promptAsync();
        } finally {
            // loading é finalizado pelo effect quando terminar o fluxo
        }
    };

    const onGuestPress = async () => {
        if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
            Alert.alert('Requer Development Build', 'Modo convidado requer um Development Build (não funciona no Expo Go).');
            return;
        }
        try {
            setLoading('guest');
            await getAuthInstance().signInAnonymously();
        } catch (e: any) {
            Alert.alert('Falha ao entrar como convidado', e?.message ?? String(e));
        } finally {
            setLoading(null);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text variant="headlineSmall" style={styles.title}>Bem-vindo(a) à Lancheria</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    Faça login para personalizar sua experiência.
                </Text>
            </View>

            <View style={styles.actions}>
                <Button
                    mode="contained"
                    icon="google"
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                    disabled={!request || loading !== null}
                    loading={loading === 'google'}
                    onPress={onGooglePress}
                >
                    Continuar com Google
                </Button>

                <Button
                    mode="outlined"
                    contentStyle={styles.buttonContent}
                    style={styles.button}
                    disabled={loading !== null}
                    loading={loading === 'guest'}
                    onPress={onGuestPress}
                >
                    Entrar como convidado
                </Button>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.footer}>
                <Text variant="bodySmall" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                    Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 96,
        height: 96,
        borderRadius: 20,
        marginBottom: 8,
    },
    title: {
        textAlign: 'center',
        fontWeight: '700',
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.8,
    },
    actions: {
        gap: 12,
    },
    button: {
        borderRadius: 12,
    },
    buttonContent: {
        height: 48,
    },
    divider: {
        marginVertical: 8,
        opacity: 0.6,
    },
    footer: {
        paddingHorizontal: 4,
    },
});
