import { useAuth } from '@/contexts/AuthContext';
import { Image, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    // Sem user: como as Tabs ficam ocultas nesse estado, não renderiza nada aqui
    if (!user) return null;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            ) : null}
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{user.displayName || 'Usuário'}</Text>
            {user.email ? <Text>{user.email}</Text> : null}
            <Button mode="outlined" onPress={() => signOut()}>
                Sair
            </Button>
        </View>
    );
}
