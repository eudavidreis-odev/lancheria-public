# Lancheria – Expo + Firebase

App de hamburgueria construído com Expo Router e Firebase (Auth, Firestore e Storage).

## Como começar

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

No output do CLI você poderá abrir em:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (limitado, não suporta react-native-firebase)

O roteamento é baseado em arquivos via **Expo Router** dentro de `app/`.

> Observação: react-native-firebase requer um Development Build (não funciona no Expo Go). Gere um dev client com EAS ou `expo run:[android|ios]`.

### Passos de configuração do Firebase

1. No [console do Firebase](https://console.firebase.google.com/), crie o projeto (ex.: `LancheriaApp`).
2. Adicione apps Android/iOS (ex.: pacote `com.seudominio.lancheria`).
3. Baixe os arquivos de configuração e coloque na raiz do projeto:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
4. Ative serviços:
   - Authentication (Google/Apple, Anônimo para "Modo Convidado")
   - Firestore Database (modo de produção)
   - Storage
5. Rode um build de desenvolvimento:

```bash
npx expo prebuild
npx expo run:android   # ou
npx expo run:ios
```

> Dica: depois do prebuild, use EAS para gerar dev clients.

## Resetar projeto exemplo

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Aprenda mais

To learn more about developing your project with Expo, look at the following resources:

- [Documentação Expo](https://docs.expo.dev/)
- [Tutorial Expo](https://docs.expo.dev/tutorial/introduction/)

## Estrutura e pontos principais

- `config/firebaseConfig.ts`: instâncias `firebaseAuth`, `db`, `firebaseStorage`.
- `styles/theme.ts`: design system (cores, espaçamentos, tipografia).
- `utils/responsive.ts`: util de responsividade (`vw`, `vh`, `fontScale`).
- `app/tabs/*`: abas Início, Busca, Pedidos e Perfil.

## Próximos passos (roadmap)

- Onboarding + Modo Convidado (Auth anônimo)
- Login Social (Google/Apple) com Firebase Auth
- Cardápio do Firestore + imagens no Storage
- Personalização de produto com preço dinâmico
- Checkout e Pedidos com atualização em tempo real
- Notificações push (FCM)

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
