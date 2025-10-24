/**
 * @packageDocumentation
 * Rota raiz: redireciona para a aba de busca.
 */
import { Redirect } from 'expo-router';

/**
 * Componente que redireciona a rota `/` para `/tabs/search`.
 */
export default function Index() {
    // Redireciona a raiz para uma aba existente (Busca)
    return <Redirect href="/tabs/search" />;
}
