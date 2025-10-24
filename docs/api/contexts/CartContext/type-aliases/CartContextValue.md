[**Lancheria v1.0.0**](../../../README.md)

***

[Lancheria](../../../README.md) / [contexts/CartContext](../README.md) / CartContextValue

# Type Alias: CartContextValue

> **CartContextValue** = `object`

Defined in: [contexts/CartContext.tsx:26](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L26)

Valor exposto pelo [CartProvider](../functions/CartProvider.md).

## Properties

### addItem()

> **addItem**: (`product`, `quantity`, `observations?`) => `void`

Defined in: [contexts/CartContext.tsx:28](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L28)

#### Parameters

##### product

[`Product`](../../../services/products/type-aliases/Product.md)

##### quantity

`number`

##### observations?

`string`

#### Returns

`void`

***

### clear()

> **clear**: () => `void`

Defined in: [contexts/CartContext.tsx:31](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L31)

#### Returns

`void`

***

### items

> **items**: [`CartItem`](CartItem.md)[]

Defined in: [contexts/CartContext.tsx:27](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L27)

***

### removeItem()

> **removeItem**: (`productId`) => `void`

Defined in: [contexts/CartContext.tsx:30](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L30)

#### Parameters

##### productId

`string`

#### Returns

`void`

***

### total

> **total**: `number`

Defined in: [contexts/CartContext.tsx:32](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L32)

***

### updateQuantity()

> **updateQuantity**: (`productId`, `quantity`) => `void`

Defined in: [contexts/CartContext.tsx:29](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/contexts/CartContext.tsx#L29)

#### Parameters

##### productId

`string`

##### quantity

`number`

#### Returns

`void`
