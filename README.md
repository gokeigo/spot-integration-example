# Spot Integration Example

Aplicación de referencia para integrar los flujos embebidos de Skip en un checkout de un prestador, clínica o plataforma aliada.

Este repositorio demuestra dos casos:

1. `Spot` estándar: el paciente autoriza a Skip a registrarlo y configurar el flujo de reembolso.
2. `CNPL / AAPD` (`Care Now, Pay Later` / `Atiéndete Ahora y Paga Después`): además del registro en Skip, se crea una orden en `SkipPay` y se inicia el flujo de financiamiento.

El objetivo de este proyecto no es implementar toda la plataforma de Skip, sino mostrar cómo un integrador externo debe:

- reunir los datos mínimos del paciente,
- inicializar el widget correctamente,
- decidir dónde manejar secretos,
- incrustar el iframe,
- reaccionar a eventos del widget,
- y separar responsabilidades entre frontend del prestador, backend del prestador, `backend-skip` y `gokeipay-api`.

## Qué Hace Este Ejemplo

Este ejemplo simula un checkout médico con una cita y, después del pago o confirmación, inicializa el widget de Skip.

Incluye:

- `Next.js` con `Pages Router`
- un flujo de simulación para paciente nuevo o ya registrado,
- dos modos de render del widget: `modal` y `div` embebido,
- validación local de RUT para pruebas,
- consulta de estado de suscripción con `GET /spot/is_user_subscribed`,
- inicialización del widget con `POST /spot/widget`,
- envío de gastos (boletas y órdenes médicas) con `POST /spot/gastos` mediante upload real de archivos,
- y para CNPL, una función server-side (`/api/create-order`) que crea la orden en `SkipPay`; en la simulación local el secreto también puede ingresarse desde la UI, por lo que no debe tomarse como patrón de producción.

No incluye:

- integración POS real del prestador,
- envío de documentos vía `gastos-url` (restringido a proveedores `dtemite` / `octava_software`),
- recepción/validación completa de webhooks del prestador,
- autenticación de operadores internos,
- ni administración de tenants, credenciales o proveedores.

## Arquitectura

### Repositorios y responsabilidades

- `spot-integration-example`: referencia para el integrador externo.
- `backend-skip`: backend principal de Spot, registro de usuarios, beneficiarios, cuentas de seguros, leads, gastos y notificaciones.
- `gokeipay-api`: API de pagos y órdenes para CNPL / SkipPay.
- `spot-form`: widget real embebible de Skip.
- `master-docs`: documentación consolidada del negocio y de los contratos observados en la plataforma.

### Responsabilidad por sistema

**Frontend del prestador**

- recolecta o precarga RUT, nombre, email y teléfono del paciente,
- decide si ofrecer reembolso estándar o CNPL,
- abre el iframe,
- escucha eventos de `postMessage`,
- y actualiza su UX según el resultado.

**Backend del prestador**

- llama a `POST /spot/widget` usando `public_key`,
- y en CNPL llama a `POST /orders` usando `client_secret`.

**Skip (`backend-skip`)**

- crea `TempWidgetToken`,
- clasifica si el paciente es nuevo, ya tiene plan, tiene prueba gratis o ya agotó beneficios,
- crea `User`, `Beneficiary` e `InsuranceAccount` cuando corresponde,
- y orquesta notificaciones y automatizaciones posteriores.

**SkipPay (`gokeipay-api`)**

- crea la orden CNPL,
- maneja identidad y método de pago,
- crea pagos y capturas,
- y notifica por webhook al prestador cuando cambia el estado de la orden.

## Credenciales y Seguridad

Hay dos tipos de credenciales y no deben confundirse:

- `public_key`: identifica al proveedor en Spot. Se usa para `POST /spot/widget` y consultas como `GET /spot/is_user_subscribed`.
- `client_secret`: credencial privilegiada de `SkipPay`. Se usa para crear órdenes CNPL. Debe permanecer del lado servidor.
- `client_id`: credencial limitada de `SkipPay`. Se usa en operaciones paciente-facing de la orden ya creada.

Reglas operativas:

- nunca expongas `client_secret` al navegador,
- no hardcodees llaves reales en el repo,
- valida `event.origin` en `postMessage`,
- y separa claramente credenciales de staging y producción.

Este ejemplo separa la llamada server-side, pero la simulación local no endurece completamente el manejo del secreto:

- variables públicas en `.env`
- secreto CNPL preferentemente en `.dev.vars`
- la UI de simulación también permite enviarlo en el body hacia la función server-side sólo para pruebas locales
- proxy server-side en `functions/api/create-order.ts`

## Variables de Entorno

### Frontend (`.env`)

```bash
NEXT_PUBLIC_GOKEI_API_URL="https://staging.backend.getskip.ai/api/spot"
NEXT_PUBLIC_GOKEI_WIDGET_URL="https://staging.spot.getskip.ai"
NEXT_PUBLIC_SKIP_PAY_API="https://staging.pay.getskip.ai"
NEXT_PUBLIC_GOKEI_PUBLIC_KEY="PK_EXAMPLE"
```

Uso:

- `NEXT_PUBLIC_GOKEI_API_URL`: base URL del backend Spot.
- `NEXT_PUBLIC_GOKEI_WIDGET_URL`: dominio esperado del iframe para validar `postMessage`.
- `NEXT_PUBLIC_SKIP_PAY_API`: base URL pública de SkipPay.
- `NEXT_PUBLIC_GOKEI_PUBLIC_KEY`: valor opcional por defecto para la demo; `PK_EXAMPLE` se ignora hasta que lo reemplaces.

### Cloudflare Pages Functions (`.dev.vars`)

```bash
NEXT_PUBLIC_SKIP_PAY_API="https://staging.pay.getskip.ai"
SKIPAY_CLIENT_SECRET="st_secret_..."
```

Uso:

- `SKIPAY_CLIENT_SECRET`: secreto del tenant/proveedor para `POST /orders`.
- usar `.dev.vars` es la forma recomendada para pruebas locales; pasar el secreto desde la UI existe en este repo sólo como atajo de simulación.

## Cómo Correr el Proyecto

### Spot estándar

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Abrir `http://localhost:3000`.

### CNPL con función server-side

```bash
pnpm install
cp .env.example .env
cp .dev.vars.example .dev.vars
pnpm dev
pnpm dev:pages
```

Notas:

- `next.config.js` reescribe `/api/create-order` a `http://127.0.0.1:3001/api/create-order` sólo en desarrollo.
- `wrangler pages dev` ejecuta la función de Cloudflare que crea la orden en SkipPay.

## Flujo Spot Estándar

Este es el flujo que un prestador debe implementar para el caso de reembolso clásico.

### 1. El prestador decide iniciar Spot

Normalmente después de:

- reservar una cita,
- confirmar una atención,
- o terminar un checkout donde quiere ofrecer el servicio de reembolso.

Datos mínimos recomendados:

- `rut`
- `name`
- `surname`
- `email`
- `phone_number`

### 2. El backend del prestador solicita un widget token

`POST /api/spot/widget?public_key={provider_public_key}`

Body típico:

```json
{
  "rut": "12345678-9",
  "user_data": {
    "name": "María",
    "surname": "González",
    "email": "maria@example.com",
    "phone_number": "+56912345678"
  }
}
```

Respuesta típica:

```json
{
  "widget_token": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://spot.getskip.ai?widget_token=550e8400-e29b-41d4-a716-446655440000&public_key=PK_..."
}
```

Qué ocurre internamente en Skip:

- se valida el `public_key`,
- se crea un `TempWidgetToken`,
- el token dura normalmente 1 hora,
- puede durar más si se usa `long_term_token=true`,
- y se registran side effects operativos como lead tracking y notificaciones internas.

### 3. El frontend del prestador embebe el iframe

Se puede hacer de dos formas:

- `modal`: overlay encima del checkout,
- `div`: iframe incrustado de forma fija en la página.

Este repo soporta ambas.

### 4. El widget clasifica al paciente

Al cargar, el widget consulta `GET /api/spot/widget/{token}` y devuelve un `event_type` que determina la UX:

- `SPOT_USER_NEW`
- `GOKEI_PRO_USER`
- `PROVIDER_CHARGES`
- `REFUNDS_LEFT`
- `FREE_TRIAL_EXPIRED_USER`

Esto es importante porque el integrador no debe asumir que todo paciente siempre verá el mismo formulario.

### 5. El paciente completa el formulario

Si el paciente es nuevo, el widget puede pedir:

- datos personales,
- selección de isapre,
- credenciales de isapre,
- seguro complementario,
- y credenciales del seguro.

Luego el widget llama a `POST /api/spot/user?widget_token=...`.

### 6. Resultado esperado

Si el flujo termina correctamente:

- el usuario queda registrado o asociado en Skip,
- se crea/actualiza su beneficiario,
- se guardan cuentas de seguro,
- y el widget emite eventos al contenedor padre.

## Hallazgo Importante: `POST /payment` y errores `400` en CNPL

Al depurar CNPL es importante no atribuir al ejemplo una llamada que en realidad pertenece al widget.

- `spot-integration-example` crea la orden CNPL con `POST /orders` y luego abre el iframe del widget.
- este repo no ejecuta `POST /orders/{order_hash}/payment` desde su frontend,
- y tampoco toma decisiones de UX a partir de los `400` de ese endpoint.

En la implementación observada, la llamada a `POST /orders/{order_hash}/payment` ocurre dentro de `spot-form`, al entrar al paso `/payment/start`.

Ese intento temprano no significa necesariamente "pagar inmediatamente". En la práctica, el widget usa esa llamada como una verificación implícita de readiness:

- si la API responde éxito, ya existe un `Payment` pendiente y el widget pasa a capture,
- si la API responde `400` con códigos de negocio como `processor_customer_identity_not_validated` o `processor_payment_method_not_found`, el widget usa esos códigos para decidir qué subpaso mostrar.

Implicancias para un integrador:

- ver `400` en consola durante CNPL no implica por sí solo una falla de integración del ejemplo,
- el origen más probable está en la lógica interna de `spot-form`,
- y si se rediseña ese comportamiento, el cambio principal debe hacerse en `spot-form`, no en este repo.

Riesgo de cambiarlo sin rediseño:

- si se elimina el intento temprano de `POST /payment` pero no se agrega otra fuente de verdad para readiness, el widget dejará de saber cuándo pedir validación de identidad y cuándo pedir medio de pago.

## Flujo CNPL / AAPD

CNPL agrega una orden de pago y financiamiento al flujo Spot.

### Resumen conceptual

1. El prestador crea una orden en `SkipPay`.
2. El prestador crea un `widget_token` en Spot con ese `order_token`.
3. El iframe detecta `order_token` y activa el flujo CNPL.
4. El paciente se registra o se reconoce como usuario existente.
5. El widget resuelve identidad, método de pago y captura del pago.
6. `SkipPay` notifica al prestador por webhook cuando la orden cambia de estado.

### Orden correcta de integración

#### Paso 1. Crear la orden CNPL

`POST /orders`

Auth:

- `Authorization: Bearer {client_secret}`

Body típico:

```json
{
  "reference": "ORDER-12345",
  "total_amount": "100000",
  "customer": {
    "rut": "12345678-9",
    "first_name": "María",
    "last_name": "González",
    "email": "maria@example.com",
    "phone_number": "+56912345678"
  }
}
```

Respuesta esperada:

- `hash`
- `reference`
- `status`
- `total_amount`

Ese `hash` es el `order_token`.

#### Paso 2. Crear el widget token asociado

`POST /api/spot/widget?public_key={provider_public_key}`

Body:

```json
{
  "rut": "12345678-9",
  "user_data": {
    "name": "María",
    "surname": "González",
    "email": "maria@example.com",
    "phone_number": "+56912345678"
  },
  "order_token": "ord_abc123"
}
```

#### Paso 3. Construir la URL del widget

La URL final debe contener:

- `widget_token`
- `public_key`
- `order_token`

Ejemplo:

```text
https://spot.getskip.ai?widget_token=...&public_key=PK_...&order_token=ord_abc123
```

#### Paso 4. Dejar que el widget maneje el resto

En CNPL, el widget orquesta llamadas a `SkipPay`, incluyendo:

- `GET /orders/{order_hash}`
- `POST /orders/{order_hash}/validate_customer_identity`
- `POST /orders/{order_hash}/add_payment_method`
- `POST /orders/{order_hash}/payment`
- `GET /orders/{order_hash}/payment/{payment_hash}/available_payment_methods`
- `POST /orders/{order_hash}/payment/{payment_hash}/capture`

Importante:

- la creación de la orden requiere `client_secret`,
- las operaciones paciente-facing usan `client_id`,
- y el integrador no debe replicar lógica interna del widget si su objetivo es sólo embeder la experiencia.

## Qué Implementa Este Repo Para CNPL

Este ejemplo crea la orden desde `functions/api/create-order.ts`, que llama a `src/server/create-order.ts`.

Secuencia local del ejemplo:

1. el usuario configura `public_key`, flujo y, en CNPL, `client_secret` en la UI de simulación,
2. al entrar a `/success`, el ejemplo inicializa en paralelo:
   - `POST /api/create-order` si el flujo es CNPL,
   - `POST /spot/widget` para obtener la URL base del widget,
3. si existe `order_token`, se concatena a `widgetData.url`,
4. y se abre el iframe.

Esto es útil para un integrador porque demuestra una decisión correcta de arquitectura:

- la creación de orden no debe ocurrir directamente contra `SkipPay` desde el navegador con `client_secret`.

Nota importante sobre este ejemplo:

- en la simulación CNPL el navegador puede enviar `client_secret` a `/api/create-order` para acelerar pruebas locales,
- pero una integración real debe guardar ese secreto sólo en backend o en variables server-side del runtime.

## Eventos del Widget

La integración embebida debe escuchar `window.postMessage`.

Eventos relevantes documentados en la plataforma:

- `WIDGET_FORM_READY`
- `WIDGET_FORM_MOUNT`
- `WIDGET_FORM_SUCCESS`
- `WIDGET_PAYMENT_SUCCESS` para CNPL
- `WIDGET_FORM_CLOSE`

En este ejemplo, el listener actual maneja principalmente:

- validación de `origin`
- cierre del modal con `WIDGET_FORM_CLOSE`

Recomendación para integradores reales:

- registrar telemetría por evento,
- cerrar el modal al finalizar,
- redirigir a confirmación propia del prestador,
- y tratar `WIDGET_PAYMENT_SUCCESS` como señal de pago exitoso en CNPL.

## Qué Necesita Saber un Prestador o Cliente para Integrar

### 1. Spot no es sólo un iframe

Hay tres capas:

- experiencia embebida para el paciente,
- APIs del backend Spot,
- y procesos posteriores de rendición, claim y notificación.

El iframe resuelve la parte de onboarding del paciente, no toda la operación de reembolsos.

### 2. El flujo widget y el flujo de gastos son distintos

Una fuente común de confusión:

- `widget` registra y clasifica al paciente,
- `gastos` y `gastos-url` cargan boletas/documentos y disparan el procesamiento de rendiciones.

Este repo demuestra ambos: `widget` (registro del paciente) y `gastos` (envío de boletas para rendición). La consola de gastos aparece en `/success` una vez que el paciente quedó registrado, porque `POST /spot/gastos` adjunta los documentos a un beneficiario existente.

### 3. POS es otro producto

El flujo `POS` usa endpoints separados como:

- `POST /spot/pos/rut`
- `POST /spot/pos/user`

No usa iframe y está pensado para operadores o staff de clínica.

### 4. La identidad del paciente se resuelve por RUT y email

La regla operacional más importante:

- el `rut` manda,
- el `email` puede reutilizar un usuario existente,
- pero un RUT ya asociado a otra cuenta puede generar conflicto.

Casos a considerar:

- paciente nuevo,
- email conocido con RUT nuevo,
- RUT ya existente,
- conflicto `RUT_OTHER_EMAIL`,
- token expirado,
- datos inválidos.

### 5. Hay diferentes resultados comerciales

Según el estado del usuario, el widget puede detectar:

- cliente ya suscrito,
- usuario con prueba gratis disponible,
- prueba gratis agotada,
- proveedor que absorbe el costo,
- usuario nuevo.

La experiencia final no debe depender de una sola “pantalla de éxito”.

### 6. CNPL requiere operación adicional fuera del widget

Si el cliente quiere vender AAPD/CNPL, además del iframe necesita:

- tenant y credenciales en `SkipPay`,
- webhook del prestador para órdenes,
- manejo de conciliación de pagos,
- y claridad comercial sobre 30% ahora, 70% después, comisiones y tiempos de cobro.

## Limitaciones y Riesgos Que el Integrador Debe Entender

### Seguridad

- el `public_key` no reemplaza controles duros de backend,
- cualquier secreto de pago debe vivir en backend,
- y el prestador debe verificar firma de webhooks de `SkipPay`.

### UX y reintentos

- el token del widget expira,
- puede haber cierres del modal sin completar el flujo,
- y el usuario puede caer en ramas distintas según su estado previo.

### Datos

- el repositorio incluye presets y simulaciones para pruebas,
- pero una integración real debe usar datos propios del paciente capturados con consentimiento,
- y evitar logs con PII o credenciales de seguros.

### Operación

- Spot no garantiza por sí solo que ya exista una rendición procesada,
- CNPL no termina cuando se captura el 30%,
- y el éxito comercial real puede depender de aprobación de reembolso, claim y cobros posteriores.

## Contratos y Endpoints Relevantes

### Spot (`backend-skip`)

- `GET /api/spot/is_user_subscribed`
- `POST /api/spot/widget`
- `GET /api/spot/widget/{token}`
- `POST /api/spot/user`
- `POST /api/spot/pos/rut`
- `POST /api/spot/pos/user`
- `POST /api/spot/gastos`
- `POST /api/spot/gastos-url`
- `GET /api/spot/user/{user_id}/check-if-successful-lead`

### SkipPay (`gokeipay-api`)

- `POST /orders`
- `GET /orders/{order_hash}`
- `POST /orders/{order_hash}/validate_customer_identity`
- `POST /orders/{order_hash}/add_payment_method`
- `POST /orders/{order_hash}/payment`
- `POST /orders/{order_hash}/payment/{payment_hash}/capture`
- `GET /orders/{order_hash}/payment/{payment_hash}/available_payment_methods`
- webhooks de estado hacia el `webhook_notification_url` del tenant

## Archivos Clave en Este Repo

- `src/components/features/checkout.tsx`: demo de checkout, cálculo de cobro y chequeo de suscripción.
- `src/components/features/appointment-confirmation.tsx`: inicialización del widget y, en CNPL, creación paralela de orden + widget token.
- `src/components/features/modal-iframe.tsx`: integración embebida modal y listener de `postMessage`.
- `src/components/features/div-iframe.tsx`: integración embebida en `div`.
- `functions/api/create-order.ts`: proxy server-side para crear órdenes CNPL.
- `src/server/create-order.ts`: cliente server-side para `POST /orders`.
- `src/components/features/gastos-console.tsx`: consola de envío de gastos que aparece en `/success` tras el registro (form-data editable, snippets cURL/JS/Python y respuesta cruda).
- `src/server/submit-gastos.ts`: cliente directo (multipart, **sin** proxy) de `POST /spot/gastos`; autentica sólo con `public_key`, por eso no necesita secreto server-side.
- `docs/cnpl.md`: explicación del flujo CNPL desde la perspectiva del widget.

## Qué No Debe Documentarse o Compartirse

Aunque se revisaron repos relacionados para consolidar esta guía, no deben exponerse en documentación para terceros:

- secretos reales,
- `client_secret` de tenants,
- tokens internos,
- claves de webhook,
- credenciales de proveedores de pago,
- credenciales de seguros de pacientes,
- ni URLs privadas o payloads internos con PII innecesaria.

## Recomendación de Implementación Real

Para un prestador que quiere salir a producción:

1. implementar backend propio para `POST /spot/widget`,
2. si usa CNPL, implementar backend propio para `POST /orders`,
3. validar y almacenar configuración por ambiente y por tenant,
4. abrir el widget en `modal` o `div` según la UX deseada,
5. escuchar eventos del iframe,
6. verificar firmas de webhook de `SkipPay`,
7. definir reintentos, timeouts y estados de negocio,
8. y separar claramente Spot estándar de POS y de cargas de `gastos`.

## Documentación Fuente Consolidada

Esta README fue consolidada a partir de:

- `master-docs/spot/spot.md`
- `master-docs/spot/SPOT_Business_Process_Code_Review.md`
- `master-docs/spot/email-rut-matrix.md`
- `master-docs/SKIP.md`
- `master-docs/cnpl/CNPL_INTEGRATION_GUIDE.md`
- `spot-integration-example/docs/cnpl.md`
- implementación observada en `spot-integration-example`, `backend-skip` y `gokeipay-api`

La idea es que un proveedor o cliente técnico pueda entender este proyecto primero, y luego profundizar en los repos de plataforma sólo cuando realmente necesite ampliar el alcance más allá de este ejemplo.
