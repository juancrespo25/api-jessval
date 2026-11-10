# Servicio de operaciones

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
