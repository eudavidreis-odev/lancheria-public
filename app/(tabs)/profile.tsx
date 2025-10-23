import { getAuth, isRNFirebaseAvailable } from '@/config/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

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
                if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
                    Alert.alert('Requer Development Build', 'Login com Google requer um Development Build (não funciona no Expo Go).');
                    return;
                }
                const RNAuth = getAuth();
                const googleCredential = RNAuth.GoogleAuthProvider.credential(idToken);
                await RNAuth().signInWithCredential(googleCredential);
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
                    <Button mode="outlined" onPress={() => signOut()}>
                        Sair
                    </Button>
                </>
            ) : (
                <>
                    <Text style={{ fontSize: 16 }}>Faça login para personalizar sua experiência</Text>
                    <Button mode="contained" disabled={!request} onPress={() => promptAsync()}>
                        Entrar com Google
                    </Button>
                </>
            )}
        </View>
    );
}
