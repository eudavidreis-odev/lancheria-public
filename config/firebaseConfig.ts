// Importações lazy para evitar crash no Expo Go (que não carrega módulos nativos)
// Use Development Build para usar @react-native-firebase/*

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeModules } from 'react-native';

export function isRNFirebaseAvailable() {
    // Evita importar módulos JS do RNFirebase. Checa apenas o módulo nativo.
    // Quando o dev build estiver corretamente linkado, RNFBAppModule estará presente.
    return Boolean((NativeModules as any)?.RNFBAppModule);
}

// Retorna o módulo de Auth (função default export)
export function getAuth() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/auth').default as unknown as {
        (): FirebaseAuthTypes.Module;
        GoogleAuthProvider: { credential: (idToken: string) => FirebaseAuthTypes.AuthCredential };
    };
}

// Retorna a instância de auth()
export function getAuthInstance() {
    return getAuth()();
}

// Retorna o módulo Firestore (default export)
export function getFirestore() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/firestore').default as unknown as FirebaseFirestoreTypes.Module;
}

// Atalho para FieldValue.serverTimestamp()
export function serverTimestamp() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('@react-native-firebase/firestore').default as unknown as FirebaseFirestoreTypes.Module & {
        FieldValue: { serverTimestamp: () => FirebaseFirestoreTypes.FieldValue };
    };
    return fs.FieldValue.serverTimestamp();
}

export type FirestoreTimestamp = FirebaseFirestoreTypes.Timestamp;