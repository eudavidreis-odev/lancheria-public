/**
 * @packageDocumentation
 * Tela de autenticação com múltiplos métodos (Google, e-mail/senha, telefone e anônimo).
 * Muitos fluxos dependem de um Development Build com Firebase nativo disponível.
 */
import { getAuth, getAuthInstance, isRNFirebaseAvailable } from '@/config/firebaseConfig';
import { layout } from '@/styles/layout';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Dialog, Divider, Portal, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession();

/**
 * Componente da tela de login. Provê UI para métodos suportados e modais de cadastro/recuperação.
 */
export default function LoginScreen() {
    const theme = useTheme();
    const [loading, setLoading] = useState<'google' | 'guest' | 'email' | 'email-signup' | 'email-reset' | 'phone-send' | 'phone-confirm' | null>(null);
    const googleConfig = (Constants?.expoConfig?.extra as any)?.googleAuth ?? {};

    // Estados para E-mail/Senha
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para Login por Smartphone (telefone + código)
    const [phone, setPhone] = useState('+55 ');
    const [smsCode, setSmsCode] = useState('');
    const [phoneConfirmation, setPhoneConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

    // Método primário selecionado na UI (exibe um de cada vez)
    const [primaryMethod, setPrimaryMethod] = useState<'email' | 'phone'>('email');

    // Formatação de telefone BR: "+55 11 99999-9999" (ou 4-4 para fixo)
    const formatPhoneBR = (value: string) => {
        const digits = value.replace(/\D/g, '');
        // Remove o 55 inicial dos dígitos para montar nacional
        let national = digits.startsWith('55') ? digits.slice(2) : digits;
        // Limite máximo: 11 dígitos (9 número + 2 DDD)
        if (national.length > 11) national = national.slice(0, 11);
        const prefix = '+55';
        if (national.length === 0) return prefix + ' ';
        if (national.length <= 2) return `${prefix} ${national}`;
        const ddd = national.slice(0, 2);
        const restRaw = national.slice(2);
        if (restRaw.length <= 4) {
            return `${prefix} ${ddd} ${restRaw}`;
        }
        if (restRaw.length <= 8) {
            const p1 = restRaw.slice(0, 4);
            const p2 = restRaw.slice(4);
            return `${prefix} ${ddd} ${p1}${p2 ? '-' + p2 : ''}`;
        }
        const p1 = restRaw.slice(0, 5);
        const p2 = restRaw.slice(5);
        return `${prefix} ${ddd} ${p1}${p2 ? '-' + p2 : ''}`;
    };

    // Modais
    const [showSignUp, setShowSignUp] = useState(false);
    const [showReset, setShowReset] = useState(false);

    // Campos dos modais
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirm, setSignUpConfirm] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        iosClientId: googleConfig.iosClientId,
        androidClientId: googleConfig.androidClientId,
        webClientId: googleConfig.webClientId,
        redirectUri: makeRedirectUri({ scheme: (Constants?.expoConfig as any)?.scheme || 'lancheria' }),
    });

    useEffect(() => {
        const completeGoogleSignIn = async () => {
            if (response?.type !== 'success') return;
            const idToken = (response.params as any).id_token as string | undefined;
            if (!idToken) return;
            if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
                Alert.alert('Requer Development Build', 'Login com Google requer um Development Build (não funciona no Expo Go).');
                setLoading(null);
                return;
            }
            try {
                setLoading('google');
                const RNAuth = getAuth();
                const googleCredential = RNAuth.GoogleAuthProvider.credential(idToken);
                await RNAuth().signInWithCredential(googleCredential);
            } catch (e: any) {
                Alert.alert('Falha ao entrar com Google', e?.message ?? String(e));
            } finally {
                setLoading(null);
            }
        };
        completeGoogleSignIn();
    }, [response]);

    const guardDevBuild = (featureLabel: string) => {
        if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
            Alert.alert('Requer Development Build', `${featureLabel} requer um Development Build (não funciona no Expo Go).`);
            setLoading(null);
            return false;
        }
        return true;
    };

    const onEmailLogin = async () => {
        setLoading('email');
        try {
            if (!guardDevBuild('Login com e-mail e senha')) return;
            const auth = getAuthInstance();
            await auth.signInWithEmailAndPassword(email.trim(), password);
        } catch (e: any) {
            let msg = e?.message ?? String(e);
            // Mensagens mais amigáveis para alguns códigos comuns
            if (e?.code === 'auth/invalid-email') msg = 'E-mail inválido.';
            if (e?.code === 'auth/user-not-found' || e?.code === 'auth/wrong-password') msg = 'Credenciais inválidas.';
            Alert.alert('Falha ao entrar com e-mail', msg);
        } finally {
            setLoading(null);
        }
    };

    const onEmailSignUp = async () => {
        setLoading('email-signup');
        try {
            if (!guardDevBuild('Criar conta com e-mail')) return;
            if (!signUpEmail || !signUpPassword) {
                Alert.alert('Dados incompletos', 'Informe e-mail e senha para criar sua conta.');
                return;
            }
            if (signUpPassword !== signUpConfirm) {
                Alert.alert('Senhas não conferem', 'A confirmação deve ser igual à senha.');
                return;
            }
            const auth = getAuthInstance();
            await auth.createUserWithEmailAndPassword(signUpEmail.trim(), signUpPassword);
            setShowSignUp(false);
            setSignUpEmail('');
            setSignUpPassword('');
            setSignUpConfirm('');
        } catch (e: any) {
            let msg = e?.message ?? String(e);
            if (e?.code === 'auth/email-already-in-use') msg = 'Este e-mail já está em uso.';
            if (e?.code === 'auth/invalid-email') msg = 'E-mail inválido.';
            if (e?.code === 'auth/weak-password') msg = 'A senha é muito fraca. Tente outra.';
            Alert.alert('Falha ao criar conta', msg);
        } finally {
            setLoading(null);
        }
    };

    const onEmailResetPassword = async () => {
        setLoading('email-reset');
        try {
            if (!guardDevBuild('Recuperar senha')) return;
            if (!resetEmail) {
                Alert.alert('Informe seu e-mail', 'Digite seu e-mail para enviarmos o link de recuperação.');
                return;
            }
            const auth = getAuthInstance();
            await auth.sendPasswordResetEmail(resetEmail.trim());
            Alert.alert('E-mail enviado', 'Enviamos um link para redefinição de senha.');
            setShowReset(false);
            setResetEmail('');
        } catch (e: any) {
            let msg = e?.message ?? String(e);
            if (e?.code === 'auth/invalid-email') msg = 'E-mail inválido.';
            if (e?.code === 'auth/user-not-found') msg = 'Não encontramos uma conta com esse e-mail.';
            Alert.alert('Falha ao enviar e-mail', msg);
        } finally {
            setLoading(null);
        }
    };

    const onPhoneSendCode = async () => {
        setLoading('phone-send');
        try {
            if (!guardDevBuild('Login com telefone')) return;
            // Normalização e validações de prefixo +55
            const raw = phone.trim();
            // Remove tudo que não for dígito e remonta em E.164
            const onlyDigits = raw.replace(/\D/g, '');
            const normalized = (raw.startsWith('+') ? '+' : '') + onlyDigits;
            if (!normalized.startsWith('+55')) {
                Alert.alert(
                    'Código do país ausente',
                    'Inclua o código do país. Ex.: +55 11 99999-9999',
                    [
                        {
                            text: 'OK',
                            onPress: () => setPhone((p) => (p.startsWith('+55') ? p : '+55 ')),
                        },
                    ]
                );
                return;
            }
            // national = sem o 55
            const national = onlyDigits.startsWith('55') ? onlyDigits.slice(2) : onlyDigits;
            if (national.length < 10) { // DDD(2) + 8 (fixo) ou 9 (móvel)
                Alert.alert('Telefone incompleto', 'Digite seu telefone completo com DDD.');
                return;
            }
            const auth = getAuthInstance();
            // signInWithPhoneNumber inicia o fluxo de verificação e retorna ConfirmationResult
            const e164 = `+55${national}`; // sem espaços e sem hífens
            const confirmation = await auth.signInWithPhoneNumber(e164);
            setPhoneConfirmation(confirmation);
            Alert.alert('Código enviado', 'Enviamos um SMS com o código de verificação.');
        } catch (e: any) {
            Alert.alert('Falha ao enviar código', e?.message ?? String(e));
        } finally {
            setLoading(null);
        }
    };

    const onPhoneConfirmCode = async () => {
        setLoading('phone-confirm');
        try {
            if (!guardDevBuild('Confirmação por telefone')) return;
            if (!phoneConfirmation) {
                Alert.alert('Código não solicitado', 'Primeiro solicite o código pelo seu telefone.');
                return;
            }
            await phoneConfirmation.confirm(smsCode);
        } catch (e: any) {
            let msg = e?.message ?? String(e);
            if (e?.code === 'auth/invalid-verification-code') msg = 'Código inválido.';
            Alert.alert('Falha ao confirmar código', msg);
        } finally {
            setLoading(null);
        }
    };

    const onGooglePress = async () => {
        try {
            setLoading('google');
            await promptAsync();
        } finally {
            // loading é finalizado pelo effect quando terminar o fluxo
        }
    };

    const onGuestPress = async () => {
        if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
            Alert.alert('Requer Development Build', 'Modo convidado requer um Development Build (não funciona no Expo Go).');
            return;
        }
        try {
            setLoading('guest');
            await getAuthInstance().signInAnonymously();
        } catch (e: any) {
            Alert.alert('Falha ao entrar como convidado', e?.message ?? String(e));
        } finally {
            setLoading(null);
        }
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Conteúdo superior que pode variar de altura */}
            <View style={styles.topContent}>
                <View style={styles.header}>
                    <Image
                        source={require('@/assets/images/icone.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text variant="headlineSmall" style={styles.title}>Bem-vindo(a) à Lancheria</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Faça login para personalizar sua experiência.
                    </Text>
                </View>

                {/* Alternador de método primário (e-mail ou telefone) */}
                <View style={styles.section}>
                    <SegmentedButtons
                        value={primaryMethod}
                        onValueChange={(val) => setPrimaryMethod(val as 'email' | 'phone')}
                        buttons={[
                            { value: 'email', label: 'E-mail' },
                            { value: 'phone', label: 'Telefone' },
                        ]}
                        density="regular"
                        style={{ marginBottom: 8 }}
                    />

                    {/* Container com altura mínima fixa para evitar salto de layout */}
                    <View style={styles.primaryFormContainer}>
                        {primaryMethod === 'email' ? (
                            <View style={{ gap: 8 }}>
                                <TextInput
                                    label="E-mail"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    style={styles.input}
                                />
                                <TextInput
                                    label="Senha"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={styles.input}
                                />
                                <Button
                                    mode="contained"
                                    contentStyle={styles.buttonContent}
                                    style={styles.button}
                                    disabled={!email || !password || loading !== null}
                                    loading={loading === 'email'}
                                    onPress={onEmailLogin}
                                >
                                    Entrar com e-mail
                                </Button>
                                <View style={styles.linkRow}>
                                    <Button
                                        mode="text"
                                        compact
                                        onPress={() => {
                                            setSignUpEmail(email);
                                            setShowSignUp(true);
                                        }}
                                    >
                                        Criar conta
                                    </Button>
                                    <Button
                                        mode="text"
                                        compact
                                        onPress={() => {
                                            setResetEmail(email);
                                            setShowReset(true);
                                        }}
                                    >
                                        Esqueci minha senha
                                    </Button>
                                </View>
                            </View>
                        ) : (
                            <View style={{ gap: 8 }}>
                                <TextInput
                                    label="Telefone"
                                    placeholder="Ex.: +55 11 99999-9999"
                                    value={phone}
                                    onChangeText={(t) => setPhone(formatPhoneBR(t))}
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    onBlur={() => {
                                        const trimmed = phone.trim();
                                        if (!trimmed) {
                                            setPhone('+55 ');
                                            return;
                                        }
                                        if (!trimmed.startsWith('+55')) {
                                            setPhone(`+55 ${trimmed}`);
                                        }
                                    }}
                                    onFocus={() => {
                                        const trimmed = phone.trim();
                                        if (!trimmed || !trimmed.startsWith('+55')) {
                                            setPhone('+55 ');
                                        }
                                    }}
                                />
                                {phoneConfirmation ? (
                                    <>
                                        <TextInput
                                            label="Código SMS"
                                            value={smsCode}
                                            onChangeText={setSmsCode}
                                            keyboardType="number-pad"
                                            style={styles.input}
                                        />
                                        <Button
                                            mode="contained"
                                            contentStyle={styles.buttonContent}
                                            style={styles.button}
                                            disabled={!smsCode || loading !== null}
                                            loading={loading === 'phone-confirm'}
                                            onPress={onPhoneConfirmCode}
                                        >
                                            Confirmar código
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        mode="contained"
                                        contentStyle={styles.buttonContent}
                                        style={styles.button}
                                        disabled={!phone || loading !== null}
                                        loading={loading === 'phone-send'}
                                        onPress={onPhoneSendCode}
                                    >
                                        Enviar código por SMS
                                    </Button>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Área inferior fixa */}
            <View style={styles.bottomArea}>
                {/* Separador textual para outros métodos */}
                <View style={styles.textSeparatorWrap}>
                    <View style={styles.textSeparatorLine} />
                    <Text variant="bodySmall" style={styles.textSeparatorText}>ou entrar com</Text>
                    <View style={styles.textSeparatorLine} />
                </View>

                {/* Google e Anônimo */}
                <View style={styles.actions}>
                    <Button
                        mode="contained"
                        icon="google"
                        contentStyle={styles.buttonContent}
                        style={styles.button}
                        disabled={!request || loading !== null}
                        loading={loading === 'google'}
                        onPress={onGooglePress}
                    >
                        Continuar com Google
                    </Button>

                    <Button
                        mode="outlined"
                        contentStyle={styles.buttonContent}
                        style={styles.button}
                        disabled={loading !== null}
                        loading={loading === 'guest'}
                        onPress={onGuestPress}
                    >
                        Entrar como convidado
                    </Button>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.footer}>
                    <Text variant="bodySmall" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </Text>
                </View>
            </View>

            {/* Modais */}
            <Portal>
                {/* Modal Criar conta */}
                <Dialog visible={showSignUp} onDismiss={() => setShowSignUp(false)}>
                    <Dialog.Title>Criar conta</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ gap: 8 }}>
                            <TextInput
                                label="E-mail"
                                value={signUpEmail}
                                onChangeText={setSignUpEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                            <TextInput
                                label="Senha"
                                value={signUpPassword}
                                onChangeText={setSignUpPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                            <TextInput
                                label="Confirmar senha"
                                value={signUpConfirm}
                                onChangeText={setSignUpConfirm}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowSignUp(false)}>Cancelar</Button>
                        <Button loading={loading === 'email-signup'} disabled={loading !== null} onPress={onEmailSignUp}>
                            Criar
                        </Button>
                    </Dialog.Actions>
                </Dialog>

                {/* Modal Esqueci minha senha */}
                <Dialog visible={showReset} onDismiss={() => setShowReset(false)}>
                    <Dialog.Title>Recuperar senha</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="E-mail"
                            value={resetEmail}
                            onChangeText={setResetEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowReset(false)}>Cancelar</Button>
                        <Button loading={loading === 'email-reset'} disabled={loading !== null} onPress={onEmailResetPassword}>
                            Enviar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: layout.screenPadding,
        paddingTop: 48,
        paddingBottom: layout.screenPadding,
        // Layout em duas regiões: topo flexível e base fixa
    },
    topContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    bottomArea: {
        paddingTop: 8,
    },
    header: {
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 96,
        height: 96,
        borderRadius: 20,
        marginTop: 32, // margem maior em relação ao topo
        marginBottom: 8,
    },
    title: {
        textAlign: 'center',
        fontWeight: '700',
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.8,
    },
    actions: {
        gap: 12,
    },
    section: {
        gap: 8,
    },
    primaryFormContainer: {
        minHeight: 240, // altura mínima para evitar deslocamentos ao alternar métodos
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        marginBottom: 4,
    },
    input: {
        backgroundColor: 'transparent',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    button: {
        borderRadius: 12,
    },
    buttonContent: {
        height: 48,
    },
    divider: {
        marginVertical: 8,
        opacity: 0.6,
    },
    footer: {
        paddingHorizontal: 4,
    },
    textSeparatorWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 8,
    },
    textSeparatorLine: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textSeparatorText: {
        opacity: 0.7,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
