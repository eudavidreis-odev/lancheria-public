# Lancheria

Uma aplicação de exemplo (Expo + React Native + Firebase) criada como projeto de portfólio.

Este repositório é uma versão pública e limpa do projeto — sensíveis (como `google-services.json`, `GoogleService-Info.plist` e keystores) foram removidos do histórico desta branch e não estão presentes aqui.

## Visão geral

- Stack: React Native (Expo), Expo Router, TypeScript
- Backend: Firebase (Auth, Firestore, Storage) — configurações privadas removidas antes de publicar
- Objetivo: demonstrar arquitetura de app mobile universal, telas de busca, carrinho e perfil, integração com Firebase e boas práticas de configuração para builds.

## Principais features

- Roteamento baseado em arquivos com Expo Router
- Autenticação (Firebase Auth — arquitetura pronta para Social Login)
- Catálogo de produtos com imagens (Firestore + Storage)
- Carrinho de compras com persistência local
- Estrutura modular e pronta para produção (separação `app/`, `components/`, `services/`, `config/`)

## Executando localmente (desenvolvimento)

1. Instale dependências

```bash
npm install
# ou
# yarn
```

2. Crie um arquivo `.env` a partir de `.env.example` e preencha as variáveis necessárias (este repo não contém seus ficheiros de configuração do Firebase)

3. Inicie o Metro / Expo

```bash
npx expo start
```

Observação: Para usar `@react-native-firebase/*` (nativos) você precisará de um Development Build (EAS) ou executar `expo prebuild` e usar `expo run:android|ios`.

## Estrutura relevante

- `app/` — telas e roteamento
- `components/` — componentes reutilizáveis
- `config/firebaseConfig.ts` — fachada para integração com RN Firebase (usa módulos nativos)
- `docs/` — documentação interna

## Segurança e nota sobre chaves

Este repositório foi criado especificamente para exposição pública. Todas as referências a chaves e ficheiros sensíveis foram removidas desta branch. Se quiser executar builds nativos com Firebase, gere suas próprias credenciais no Console do Firebase e use variáveis de ambiente ou os mecanismos de secret do serviço de CI (GitHub Secrets / EAS secrets).

## Licença

MIT — sinta-se à vontade para clonar e estudar o código.

## Contato

Se quiser falar sobre este projeto (demonstração, dúvidas técnicas ou oportunidades), abra uma issue ou contacte via perfil do GitHub.

