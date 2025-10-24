/**
 * @packageDocumentation
 * Tela de pedidos dentro das tabs. Requer autenticação para exibir histórico.
 */
import { useAuth } from '@/contexts/AuthContext';
import { Text, View } from 'react-native';

/**
 * Componente de pedidos dentro das tabs. Mostra mensagem para usuários não autenticados.
 */
export default function OrdersScreen() {
    const { user } = useAuth();
    if (!user) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <Text style={{ textAlign: 'center' }}>Faça login para ver seus pedidos e acompanhar o status em tempo real.</Text>
            </View>
        );
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Pedidos (em breve: lista e status em tempo real)</Text>
        </View>
    );
}
