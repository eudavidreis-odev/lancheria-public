/**
 * @packageDocumentation
 * Facades para Firebase (Auth e Firestore) com importação lazy para evitar crash no Expo Go.
 * Requer Development Build para módulos nativos `@react-native-firebase/*`.
 */
// Importações lazy para evitar crash no Expo Go (que não carrega módulos nativos)
// Use Development Build para usar @react-native-firebase/*

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeModules } from 'react-native';

/**
 * Verifica se os módulos nativos do React Native Firebase estão disponíveis.
 */
export function isRNFirebaseAvailable() {
    // Evita importar módulos JS do RNFirebase. Checa apenas o módulo nativo.
    // Quando o dev build estiver corretamente linkado, RNFBAppModule estará presente.
    return Boolean((NativeModules as any)?.RNFBAppModule);
}

// Retorna o módulo de Auth (função default export)
/**
 * Retorna o módulo de Auth (`@react-native-firebase/auth`) sem importação estática.
 */
export function getAuth() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/auth').default as unknown as {
        (): FirebaseAuthTypes.Module;
        GoogleAuthProvider: { credential: (idToken: string) => FirebaseAuthTypes.AuthCredential };
    };
}

// Retorna a instância de auth()
/** Retorna a instância `auth()` atual. */
export function getAuthInstance() {
    return getAuth()();
}

// Retorna o módulo Firestore (default export)
/**
 * Retorna o módulo do Firestore (`@react-native-firebase/firestore`) sem importação estática.
 */
export function getFirestore() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-firebase/firestore').default as unknown as FirebaseFirestoreTypes.Module;
}

// Atalho para FieldValue.serverTimestamp()
/** Atalho para `FieldValue.serverTimestamp()` do Firestore. */
export function serverTimestamp() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('@react-native-firebase/firestore').default as unknown as FirebaseFirestoreTypes.Module & {
        FieldValue: { serverTimestamp: () => FirebaseFirestoreTypes.FieldValue };
    };
    return fs.FieldValue.serverTimestamp();
}

/** Alias local para o tipo de timestamp do Firestore. */
export type FirestoreTimestamp = FirebaseFirestoreTypes.Timestamp;