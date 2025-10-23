import { Redirect } from 'expo-router';

export default function Index() {
    // Redireciona a raiz para uma aba existente (Busca)
    return <Redirect href="/tabs/search" />;
}
