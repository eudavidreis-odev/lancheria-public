[**Lancheria v1.0.0**](../../../../README.md)

***

[Lancheria](../../../../README.md) / [components/ui/FloatingCartButton](../README.md) / FloatingCartButtonProps

# Type Alias: FloatingCartButtonProps

> **FloatingCartButtonProps** = `object`

Defined in: components/ui/FloatingCartButton.tsx:14

## Properties

### count

> **count**: `number`

Defined in: components/ui/FloatingCartButton.tsx:20

Quantidade total do carrinho para exibir no badge.

***

### onPress()

> **onPress**: () => `void`

Defined in: components/ui/FloatingCartButton.tsx:22

Ação ao tocar no botão (toque leve, sem arrastar).

#### Returns

`void`

***

### persistKey?

> `optional` **persistKey**: `string`

Defined in: components/ui/FloatingCartButton.tsx:24

Chave para persistir posição entre telas/sessões. Se omitido, não persiste.

***

### right

> **right**: `number`

Defined in: components/ui/FloatingCartButton.tsx:18

Offset inicial da direita (px). Geralmente `16`.

***

### top

> **top**: `number`

Defined in: components/ui/FloatingCartButton.tsx:16

Offset inicial do topo (px). Geralmente `insets.top + 96` (ou subtraindo headerHeight).
