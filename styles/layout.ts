// Layout tokens centralizados para padronizar espaçamentos entre telas
// Use estes valores em vez de números mágicos (32, 16, 12, 8)

export const layout = {
    // Padding padrão para a maioria das telas
    screenPadding: 32 as const,
    // Padding reduzido para a tela de busca
    searchPadding: 16 as const,

    // Gaps utilitários
    gapXs: 4 as const,
    gapSm: 8 as const,
    gapMd: 12 as const,
    gapLg: 16 as const,
} as const;

export type LayoutTokens = typeof layout;
