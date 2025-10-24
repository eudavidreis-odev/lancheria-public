[**Lancheria v1.0.0**](../../../../README.md)

***

[Lancheria](../../../../README.md) / [components/ui/icon-symbol](../README.md) / IconSymbolProps

# Type Alias: IconSymbolProps

> **IconSymbolProps** = `object`

Defined in: [components/ui/icon-symbol.tsx:44](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L44)

Props for the `IconSymbol` component.

- `name` follows the SF Symbols naming. When running on Android/web the
  name will be mapped to a Material Icon via the `MAPPING` table.

## Properties

### color?

> `optional` **color**: `string` \| `OpaqueColorValue`

Defined in: [components/ui/icon-symbol.tsx:50](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L50)

Icon color. Can be a string or an OpaqueColorValue (native).

***

### name

> **name**: `SymbolViewProps`\[`"name"`\]

Defined in: [components/ui/icon-symbol.tsx:46](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L46)

SF Symbol name (e.g. `"house.fill"`, `"magnifyingglass"`).

***

### size?

> `optional` **size**: `number`

Defined in: [components/ui/icon-symbol.tsx:48](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L48)

Icon size in pixels. Defaults to 24.

***

### style?

> `optional` **style**: `StyleProp`\<`TextStyle`\>

Defined in: [components/ui/icon-symbol.tsx:52](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L52)

Optional style forwarded to the underlying icon component.

***

### weight?

> `optional` **weight**: `SymbolWeight`

Defined in: [components/ui/icon-symbol.tsx:54](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/icon-symbol.tsx#L54)

Weight for SF Symbols (kept for parity if needed).
