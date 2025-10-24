[**Lancheria v1.0.0**](../../../../README.md)

***

[Lancheria](../../../../README.md) / [components/ui/collapsible](../README.md) / Collapsible

# Function: Collapsible()

> **Collapsible**(`__namedParameters`): `Element`

Defined in: [components/ui/collapsible.tsx:33](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/components/ui/collapsible.tsx#L33)

Renderiza um bloco colapsável com cabeçalho e conteúdo.

- Ao tocar no cabeçalho, alterna a visibilidade do conteúdo.
- Usa `IconSymbol` com rotação para indicar estado aberto/fechado.

## Parameters

### \_\_namedParameters

[`CollapsibleProps`](../type-aliases/CollapsibleProps.md)

## Returns

`Element`

## Example

```ts
<Collapsible title="Detalhes">
  <ThemedText>Conteúdo interno</ThemedText>
</Collapsible>
```
