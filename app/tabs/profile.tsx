import LoginScreen from '@/app/auth/login';
import { useAuth } from '@/contexts/AuthContext';
import { layout } from '@/styles/layout';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Avatar, Divider, List, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Sem user: renderiza a tela de Login dentro da aba Perfil
    if (!user) return <LoginScreen />;

    const initials = (user.displayName || 'Usuário')
        .split(' ')
        .map((p) => p[0])
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
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{user.displayName || 'Usuário'}</Text>
                {user.email ? <Text style={{ opacity: 0.8 }}>{user.email}</Text> : null}
            </View>

            <List.Section>
                <List.Subheader>Conta</List.Subheader>
                <List.Item
                    title="Meus pedidos"
                    description="Acompanhe seu histórico"
                    left={(p) => <List.Icon {...p} icon="clipboard-list-outline" />}
                    onPress={() => router.push({ pathname: '/profile/orders' })}
                />
                <Divider />
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
