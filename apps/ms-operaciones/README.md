# Servicio de operaciones

## Consultar envíos de órdenes

`GET /ordenes/query?fecha_inicial=2026-11-01&fecha_final=2026-11-18&estado=PD&destino=150101`
devuelve en `data` un arreglo de envíos con `id_guia`, `cliente`, `ccosto`,
`nombres`, `direccion`, `destino`, `fecha_registro`, `estado` descriptivo y
`total_documentos`. Se ordenan por fecha de registro descendente.

`fecha_inicial` y `fecha_final` son obligatorias en formato `AAAA-MM-DD` y
comprenden ambos días completos según la fecha almacenada en la base de datos.
El rango no puede estar invertido. Filtros opcionales: `estado` y `destino` de
la guía, `numero`, `origen`, `customer` y `ccosto` de la orden, `nombre` del
destinatario y `numero_documento` del documento adjunto. `numero` debe ser un
entero no negativo de hasta 2147483647. `numero_documento` es texto de hasta
50 caracteres y se compara exactamente con los documentos de cada guía.
El nombre se busca por coincidencia parcial sin distinguir mayúsculas de
minúsculas; `%`, `_` y `\` se tratan como caracteres literales. Los demás
filtros usan igualdad exacta. No se admiten filtros vacíos ni parámetros
desconocidos.

Ejemplo: `GET /ordenes/query?fecha_inicial=2026-11-01&fecha_final=2026-11-18&numero_documento=F001-123`.
`total_documentos` cuenta todos los documentos de la guía, no solo los que
coinciden con el filtro.

Un filtro inválido devuelve HTTP 400; sin coincidencias se responde HTTP 200
con `data: []`. Un fallo de base de datos devuelve HTTP 500.

## Consultar orden y envíos

`GET /ordenes/656888/detalle` devuelve la cabecera de la orden en `data` y sus
envíos en `data.envios`, ordenados por ítem. Cada envío incluye `id_guia`,
`nombres`, `direccion`, `destino` y el estado descriptivo. Si no hay envíos
que cumplan las uniones de la consulta, `envios` es un arreglo vacío.

El número debe ser un entero no negativo de hasta 2147483647; un valor inválido
produce HTTP 400. Si la cabecera no existe o no cumple las uniones obligatorias
con cliente, centro de costo, ubigeo, provincia y usuario, devuelve HTTP 404.

Ejemplo de respuesta:

```json
{
  "status": 200,
  "success": true,
  "message": "Orden retrieved successfully",
  "data": {
    "numero": 656888,
    "cliente": "Cliente",
    "centrocosto": "Centro",
    "origen": "Lima - Lima - Miraflores",
    "provincia_cubierta": "Lima",
    "fecha_registro": "2026-01-01T10:00:00.000Z",
    "usuario": "Ana - Perez",
    "envios": [
      {
        "id_guia": 1,
        "nombres": "Juan",
        "direccion": "Av. Principal",
        "destino": "Lima - Lima - Surco",
        "estado": "Pendiente"
      }
    ]
  }
}
```

## Consultar detalle de una guía

`GET /guias/:id_guia/detalle` devuelve en `data` el detalle de la guía.
Por ejemplo: `GET /guias/123/detalle`. El campo `descripcion` corresponde
al tipo de envío y `total_documentos` cuenta los documentos adjuntos.
Los campos `imagen1`, `imagen2` e `imagen3` pueden ser nulos; `imagen1`
corresponde a la columna `imagen` de la guía.
El identificador debe ser un entero no negativo de hasta 2147483647; un valor
inválido produce HTTP 400. Si la guía no existe o no cumple las uniones de la
consulta, devuelve HTTP 404. Un fallo de base de datos devuelve HTTP 500.

## Registrar un documento adjunto

`POST /docadjuntos` recibe un JSON con los siguientes campos:

```json
{
  "id_guia": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numero": "F001-123",
  "tipo": 1
}
```

`id_guia` es el UUID de la columna `guia.id`, no el número de `guia.id_guia`.
`numero` es obligatorio y admite hasta 50 caracteres. Los valores de `tipo` son:
1 factura, 2 boleta, 3 guía de remisión, 4 guía y 5 orden de servicio.

La respuesta exitosa es HTTP 201 e incluye en `data` el identificador generado,
el UUID de la guía, el número y el tipo. Los datos inválidos producen HTTP 400;
una guía inexistente produce HTTP 404.

## Consultar guías para impresión

`GET /ordenes/:numero/guias/impresion?itemDesde=1&itemHasta=10` devuelve un PDF
(`Content-Type: application/pdf`) con las guías de la orden, ordenadas por ítem,
con hasta seis guías por hoja A4. El código de barras Code 128 contiene `id_guia`.
El encabezado utiliza el logotipo `images/jessval.png`.
La provincia padre aparece junto a la empresa; la provincia del ubigeo se muestra
en la ciudad.
El número de orden es
obligatorio. Los límites son opcionales, pero deben enviarse juntos; ambos son
inclusivos. Todos los valores enviados deben ser enteros no negativos.
Sin límites (`GET /ordenes/:numero/guias/impresion`) se devuelven todas las
guías de la orden. Un rango inválido produce HTTP 400; si no hay resultados,
se devuelve HTTP 404. Los textos que no caben en la guía se muestran abreviados
y se incluyen completos en páginas de detalle al final del PDF.

`documentos` contiene los documentos adjuntos separados por ` | ` o `null` si
no hay documentos. Se emplean las etiquetas de la consulta solicitada: tipo 1
Factura, tipo 2 Guia Remision, tipo 3 Orden de Servicio y otros tipos Otro.

## Imprimir etiquetas con código de barras

`GET /ordenes/:numero/guias/etiquetas-barra?itemDesde=1&itemHasta=10` devuelve
un PDF para impresora Zebra: hojas horizontales de 110 × 30 mm con dos etiquetas
por hoja y código Code 128 con `id_guia`. Los filtros y errores son los mismos
que en la impresión de guías; sin límites se incluyen todas las guías de la
orden. Los textos largos se abrevian para que no se superpongan.
