import { useAuth } from '@/contexts/AuthContext';
import auth from '@react-native-firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button, Image, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    const googleConfig = (Constants?.expoConfig?.extra as any)?.googleAuth ?? {};

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId: googleConfig.iosClientId,
        androidClientId: googleConfig.androidClientId,
        webClientId: googleConfig.webClientId,
        redirectUri: makeRedirectUri({ scheme: (Constants?.expoConfig as any)?.scheme || 'lancheria' }),
    });

    useEffect(() => {
        const signInWithGoogle = async () => {
            if (response?.type === 'success') {
                const idToken = (response.params as any).id_token as string | undefined;
                if (!idToken) return;
                const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                await auth().signInWithCredential(googleCredential);
            }
        };
        signInWithGoogle();
    }, [response]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {user ? (
                <>
                    {user.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={{ width: 96, height: 96, borderRadius: 48 }} />
                    ) : null}
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{user.displayName || 'Usuário'}</Text>
                    {user.email ? <Text>{user.email}</Text> : null}
                    <Button title="Sair" onPress={() => signOut()} />
                </>
            ) : (
                <>
                    <Text style={{ fontSize: 16 }}>Faça login para personalizar sua experiência</Text>
                    <Button title="Entrar com Google" disabled={!request} onPress={() => promptAsync()} />
                </>
            )}
        </View>
    );
}
