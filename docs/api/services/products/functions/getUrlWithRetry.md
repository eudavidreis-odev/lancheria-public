[**Lancheria v1.0.0**](../../../README.md)

***

[Lancheria](../../../README.md) / [services/products](../README.md) / getUrlWithRetry

# Function: getUrlWithRetry()

> **getUrlWithRetry**(`ref`, `retries`): `Promise`\<`any`\>

Defined in: [services/products.ts:48](https://github.com/eudavidreis-odev/lancheria/blob/documentacao_inicial/services/products.ts#L48)

Obtém URL de download do Storage com retentativas para contornar latências/propagação.

## Parameters

### ref

`any`

Referência do arquivo no Storage.

### retries

`number` = `5`

Número de tentativas.

## Returns

`Promise`\<`any`\>
