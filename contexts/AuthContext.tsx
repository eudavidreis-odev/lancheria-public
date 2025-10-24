/**
 * @packageDocumentation
 * Contexto de autenticação do app. Fornece o usuário atual, estado de inicialização
 * e utilitários como signOut. Usa Firebase Auth quando disponível (Development Build).
 */
import { getAuthInstance, getFirestore, isRNFirebaseAvailable, serverTimestamp } from '@/config/firebaseConfig';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Representa o usuário autenticado da aplicação (ou `null` quando deslogado).
 */
export type AppUser = FirebaseAuthTypes.User | null;

/**
 * Valor exposto pelo {@link AuthProvider}. 
 */
export interface AuthContextValue {
    user: AppUser;
    initializing: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

/**
 * Garante que exista um documento do usuário em `firestore/users` com dados mínimos.
 * @param user Usuário autenticado do Firebase.
 */
async function ensureUserDocument(user: FirebaseAuthTypes.User) {
    const fs = getFirestore();
    const ref = fs.collection('users').doc(user.uid);
    await ref.set(
        {
            uid: user.uid,
            email: user.email ?? null,
            displayName: user.displayName ?? null,
            photoURL: user.photoURL ?? null,
            provider: user.providerData?.[0]?.providerId ?? null,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
        },
        { merge: true }
    );
}

/**
 * Provider de autenticação. Deve envolver a árvore de componentes que depende de `useAuth`.
 * Quando Firebase não está disponível (ex.: Expo Go), inicializa com `initializing=false`.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUser>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Se RNFirebase não estiver disponível (Expo Go), não tenta inicializar
        if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
            setInitializing(false);
            return () => { };
        }

        const unsubscribe = getAuthInstance().onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                try {
                    await ensureUserDocument(u);
                } catch (e) {
                    console.warn('Failed to ensure user doc', e);
                }
            }
            if (initializing) setInitializing(false);
        });
        return unsubscribe;
    }, [initializing]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            initializing,
            signOut: () => (isRNFirebaseAvailable() ? getAuthInstance().signOut() : Promise.resolve()),
        }),
        [user, initializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
