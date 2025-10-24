[**Lancheria v1.0.0**](../../../../README.md)

***

[Lancheria](../../../../README.md) / [components/ui/icon-symbol](../README.md) / IconSymbol

# Function: IconSymbol()

> **IconSymbol**(`props`): `Element`

Defined in: [components/ui/icon-symbol.tsx:74](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L74)

Cross-platform icon component.

On iOS this project prefers native SF Symbols. On Android and web we
render a visually-similar icon from Material Icons using the `MAPPING`
table above. If no mapping exists the component falls back to
`help-outline`.

## Parameters

### props

[`IconSymbolProps`](../type-aliases/IconSymbolProps.md)

## Returns

`Element`

## Remarks

Keep `MAPPING` updated when you introduce new SF Symbols that must
appear on non-iOS platforms. Prefer SF Symbols names for the `name`
prop across the codebase so designers/developers can reference a
single canonical identifier.

## Example

```ts
<IconSymbol name="cart.fill" color="#fff" size={20} />
```
