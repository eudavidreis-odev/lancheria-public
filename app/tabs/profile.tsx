/**
 * Tela de Perfil. Se não houver usuário autenticado, renderiza a tela de Login.
 */
import LoginScreen from '@/app/auth/login';
import { useAuth } from '@/contexts/AuthContext';
import { layout } from '@/styles/layout';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Componente de tela de Perfil exibindo informações básicas e ações de conta.
 */
export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Sem user: renderiza a tela de Login dentro da aba Perfil
    if (!user) return <LoginScreen />;

    // Deriva um nome amigável do usuário: prefere displayName, depois providerData, depois parte do e-mail
    const displayName =
        user.displayName ||
        (user.providerData && user.providerData[0] && (user.providerData[0].displayName as string)) ||
        (user.email ? user.email.split('@')[0] : 'Usuário');

    const initials = (displayName || 'Usuário')
        .split(' ')
        .map((p) => (p ? p[0] : ''))
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                paddingTop: insets.top + layout.screenPadding,
                paddingHorizontal: layout.screenPadding,
                paddingBottom: layout.screenPadding,
                gap: layout.gapLg,
            }}
        >
            <View style={{ alignItems: 'center', gap: 8 }}>
                {user.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={{ width: 96, height: 96, borderRadius: 48 }} />
                ) : (
                    <Avatar.Text size={96} label={initials} />
                )}
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{displayName}</Text>
                {user.email ? <Text style={{ opacity: 0.8 }}>{user.email}</Text> : null}
            </View>

            <List.Section>
                <List.Subheader>Conta</List.Subheader>
                <List.Item
                    title="Sair"
                    description="Encerrar sessão"
                    left={(p) => <List.Icon {...p} icon="logout" />}
                    onPress={() => signOut()}
                />
            </List.Section>
        </ScrollView>
    );
}
