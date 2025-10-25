[**Lancheria v1.0.0**](../../../../README.md)

***

[Lancheria](../../../../README.md) / [components/ui/FloatingCartButton](../README.md) / FloatingCartButtonProps

# Type Alias: FloatingCartButtonProps

> **FloatingCartButtonProps** = `object`

Defined in: [components/ui/FloatingCartButton.tsx:14](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L14)

## Properties

### count

> **count**: `number`

Defined in: [components/ui/FloatingCartButton.tsx:20](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L20)

Quantidade total do carrinho para exibir no badge.

***

### insets

> **insets**: `object`

Defined in: [components/ui/FloatingCartButton.tsx:28](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L28)

Insets seguros da tela (safe-area).

#### bottom

> **bottom**: `number`

#### left

> **left**: `number`

#### right

> **right**: `number`

#### top

> **top**: `number`

***

### onPress()

> **onPress**: () => `void`

Defined in: [components/ui/FloatingCartButton.tsx:22](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L22)

Ação ao tocar no botão (toque leve, sem arrastar).

#### Returns

`void`

***

### persistKey?

> `optional` **persistKey**: `string`

Defined in: [components/ui/FloatingCartButton.tsx:24](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L24)

Chave para persistir posição entre telas/sessões. Se omitido, não persiste.

***

### right

> **right**: `number`

Defined in: [components/ui/FloatingCartButton.tsx:18](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L18)

Offset de margem da direita (px) ao ancorar em RIGHT. Ex.: 16.

***

### top

> **top**: `number`

Defined in: [components/ui/FloatingCartButton.tsx:16](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L16)

Offset absoluto alvo do topo (px) ao ancorar em TOP. Idealmente visibleTop + marginTop.

***

### visibleTop

> **visibleTop**: `number`

Defined in: [components/ui/FloatingCartButton.tsx:26](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/FloatingCartButton.tsx#L26)

Topo visível do conteúdo (safe-area + header, se existir). Ex.: insets.top ou insets.top + headerHeight.
