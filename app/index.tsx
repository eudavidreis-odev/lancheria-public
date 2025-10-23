import { Redirect } from 'expo-router';

export default function Index() {
    // Redireciona a raiz para o grupo de tabs
    return <Redirect href="/tabs" />;
}
