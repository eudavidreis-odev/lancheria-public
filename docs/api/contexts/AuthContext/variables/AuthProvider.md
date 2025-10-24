[**Lancheria v1.0.0**](../../../README.md)

***

[Lancheria](../../../README.md) / [contexts/AuthContext](../README.md) / AuthProvider

# Variable: AuthProvider

> `const` **AuthProvider**: `React.FC`\<\{ `children`: `React.ReactNode`; \}\>

Defined in: [contexts/AuthContext.tsx:58](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/AuthContext.tsx#L58)

Provider de autenticação. Deve envolver a árvore de componentes que depende de `useAuth`.
Quando Firebase não está disponível (ex.: Expo Go), inicializa com `initializing=false`.
