import { db } from '@/config/firebaseConfig';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppUser = FirebaseAuthTypes.User | null;

interface AuthContextValue {
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

async function ensureUserDocument(user: FirebaseAuthTypes.User) {
    const ref = db.collection('users').doc(user.uid);
    await ref.set(
        {
            uid: user.uid,
            email: user.email ?? null,
            displayName: user.displayName ?? null,
            photoURL: user.photoURL ?? null,
            provider: user.providerData?.[0]?.providerId ?? null,
            updatedAt: firestore.FieldValue.serverTimestamp(),
            createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUser>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (u) => {
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
            signOut: () => auth().signOut(),
        }),
        [user, initializing]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
