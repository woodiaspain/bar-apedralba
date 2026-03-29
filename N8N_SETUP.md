# Configuración del flujo n8n — Bar A Pedralba

## Arquitectura del flujo

```
WhatsApp (dueño)
  → Evolution API  →  n8n Webhook Trigger
                          │
                    ¿Es el dueño?
                    ├── NO  → Ignorar (fin)
                    └── SÍ
                          │
                    Parsear con OpenAI (gpt-4o-mini)
                          │
                    Extraer JSON de IA (Code node)
                          │
                    Actualizar Web  →  POST /api/webhook/menu
                          │
                    Preparar Confirmación (Code node)
                          │
                    Responder por WhatsApp (Evolution API)
```

---

## Paso 1 — Importar el workflow

1. Abrir n8n → **Workflows** → botón `+` → **Import from file**
2. Seleccionar el archivo `bar-pedralba-menu-workflow.json` de este proyecto
3. El workflow se importa **desactivado** — hay que configurar credenciales antes de activar

---

## Paso 2 — Configurar credenciales

### Credencial: OpenAI API Key

El nodo **"Parsear con OpenAI"** usa una credencial de tipo **HTTP Header Auth**.

1. Ir a **Credentials** → **New** → buscar `Header Auth`
2. Configurar:
   - **Name:** `OpenAI — Authorization Header`
   - **Name** (del header): `Authorization`
   - **Value:** `Bearer <TU_OPENAI_API_KEY>`
3. Guardar y asignar al nodo "Parsear con OpenAI"

---

## Paso 3 — Configurar variables de n8n

Ir a **Settings** → **Variables** y crear las siguientes:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `OWNER_WHATSAPP` | JID del dueño en WhatsApp | `34612345678@s.whatsapp.net` |
| `WEB_URL` | URL del proyecto en Vercel (sin barra final) | `https://bar-a-pedralba.vercel.app` |
| `WEBHOOK_SECRET` | Mismo valor que `WEBHOOK_SECRET` en `.env.local` | `abc123...` |
| `EVOLUTION_API_URL` | URL de tu instancia Evolution API (sin barra final) | `https://evolution.tudominio.com` |
| `EVOLUTION_INSTANCE` | Nombre de la instancia en Evolution API | `bar-pedralba` |
| `EVOLUTION_API_KEY` | API key de Evolution API | `tu-api-key` |

> **Cómo encontrar el JID del dueño:** Es el número con prefijo de país sin `+`, seguido de `@s.whatsapp.net`. Ejemplo: número `+34 612 345 678` → JID `34612345678@s.whatsapp.net`.
> Puedes verlo en los logs de Evolution API cuando el dueño manda un primer mensaje.

---

## Paso 4 — URL del webhook (para configurar Evolution API)

Una vez importado el workflow y con n8n activo, la URL del webhook será:

```
https://<TU_N8N_DOMINIO>/webhook/whatsapp-menu
```

> Para probar en local: `http://localhost:5678/webhook/whatsapp-menu`
> En producción: depende de dónde tengas alojado n8n (Railway, Render, VPS, etc.)

### Configurar en Evolution API

1. Ir a Evolution API Dashboard → tu instancia → **Webhook**
2. Configurar:
   - **URL:** `https://tu-n8n.dominio.com/webhook/whatsapp-menu`
   - **Events:** activar `MESSAGES_UPSERT` (único evento necesario)
   - **Enabled:** sí

---

## Paso 5 — Activar el workflow

1. Abrir el workflow importado en n8n
2. Verificar que la credencial OpenAI está asignada al nodo **"Parsear con OpenAI"**
3. Hacer clic en el toggle **Inactive** → **Active** (arriba a la derecha)
4. El webhook queda escuchando en la URL del paso 4

---

## Descripción de los nodos

### Nodo 1 — WhatsApp Webhook
- **Tipo:** Webhook Trigger
- **Método:** POST
- **Path:** `/whatsapp-menu`
- Recibe el payload de Evolution API cuando llega un mensaje

### Nodo 2 — ¿Es el dueño?
- **Tipo:** IF
- **Condición:** `$json.data.key.remoteJid === $vars.OWNER_WHATSAPP`
- **True:** continúa el flujo
- **False:** va al nodo "Ignorar mensaje" (sin acción)

### Nodo 3 — Parsear con OpenAI
- **Tipo:** HTTP Request → `POST https://api.openai.com/v1/chat/completions`
- **Modelo:** `gpt-4o-mini`
- **Response format:** `json_object` (garantiza JSON válido en la respuesta)
- **Autenticación:** credencial `OpenAI — Authorization Header`
- Lee el mensaje de `$('WhatsApp Webhook').item.json.data.message.conversation`

#### System prompt de la IA

```
Eres un asistente del Bar A Pedralba en Bergondo, Galicia. Tu tarea es extraer
información de menús y paellas de mensajes en español (con posibles variaciones gallegas).

Analiza el mensaje y devuelve ÚNICAMENTE un JSON válido sin texto adicional.

Para menú del día:
{"tipo":"menu_dia","fecha":"YYYY-MM-DD","primeros":["plato"],"segundos":["plato"],"postre":null,"precio":12.50}

Para paellas:
{"tipo":"paella","fecha":"YYYY-MM-DD","tipo_paella":"Paella mixta","precio":14.00,"plazas_disponibles":null,"hora_recogida":null}

Reglas:
- Si no se menciona fecha, usa la fecha de hoy (España, zona Europe/Madrid)
- plazas_disponibles y hora_recogida son opcionales (pon null si no se mencionan)
- postre es opcional (pon null si no se menciona)
- Normaliza los nombres de platos en minúsculas
- Interpreta variaciones: "de primero", "para primero", "primero tenemos", etc.
- Interpreta variaciones gallegas: "hai", "temos", "hoxe", "primeiro", etc.
- El precio puede venir como "12€", "12 euros", "doce euros", "12,50€", etc.
- Devuelve SOLO el JSON, sin texto adicional, sin markdown, sin explicaciones
```

### Nodo 4 — Extraer JSON de IA
- **Tipo:** Code (JavaScript)
- Lee `choices[0].message.content` de la respuesta de OpenAI
- Parsea el JSON y valida que `tipo` sea `menu_dia` o `paella`
- Lanza error si el JSON no es válido (n8n notificará el fallo)

### Nodo 5 — Actualizar Web
- **Tipo:** HTTP Request → `POST $vars.WEB_URL/api/webhook/menu`
- **Headers:** `x-api-key: $vars.WEBHOOK_SECRET`
- **Body:** el JSON parseado del nodo anterior
- `neverError: true` para capturar errores HTTP como datos y manejarlos en el siguiente nodo

### Nodo 6 — Preparar Confirmación
- **Tipo:** Code (JavaScript)
- Construye el mensaje de WhatsApp según el resultado:
  - `ok: true` + `tipo: "menu_dia"` → `"✅ Menú del [fecha] publicado correctamente"`
  - `ok: true` + `tipo: "paella"` → `"✅ [tipo_paella] publicada para el [fecha]"`
  - `ok: false` → `"❌ No entendí el mensaje. Ejemplo: 'Menú de hoy: primero ensalada, segundo merluza, postre flan, 12€'"`
- Recupera el JID del dueño de `$('WhatsApp Webhook').item.json.data.key.remoteJid`

### Nodo 7 — Responder por WhatsApp
- **Tipo:** HTTP Request → `POST $vars.EVOLUTION_API_URL/message/sendText/$vars.EVOLUTION_INSTANCE`
- **Header:** `apikey: $vars.EVOLUTION_API_KEY`
- **Body:** `{ "number": "<jid>", "text": "<mensaje>" }`

---

## Ejemplos de mensajes válidos

### Menú del día

```
Menú de hoy: de primero ensalada mixta y caldo gallego.
De segundo merluza a la plancha o pollo asado.
Postre flan casero. Precio 12 euros
```

```
hoy tenemos: primeiro ensalada e caldo. Segundo lomo con pimientos
o bacalao al horno. Sen postre. 11,50€
```

```
Menú: primeros caldo gallego y paté con tostadas.
Segundos merluza frita y carne guisada. Flan de postre. 13€
```

### Paellas

```
Este sábado hay paella mixta a 14€. Quedan 20 plazas, para recoger a las 14h
```

```
Domingo paella de marisco, 16 euros persona, plazas limitadas
```

```
Hoy domingo temos arroz negro a 15€, hai 12 racións
```

---

## Pruebas del flujo

### Probar el webhook manualmente (antes de tener Evolution API)

```bash
curl -X POST http://localhost:5678/webhook/whatsapp-menu \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "key": {
        "remoteJid": "34612345678@s.whatsapp.net"
      },
      "message": {
        "conversation": "Menú de hoy: ensalada y caldo de primero, merluza o pollo de segundo. Flan de postre. 12€"
      }
    }
  }'
```

### Verificar en n8n

1. **Workflows** → tu workflow → **Executions** (icono reloj)
2. Ver el último execution para inspeccionar el input/output de cada nodo

### Verificar en Supabase

Ir a Supabase → Table Editor → tabla `menu_dia` → confirmar que se insertó el registro

---

## Resolución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| Nodo "¿Es el dueño?" siempre va a False | JID mal configurado en `OWNER_WHATSAPP` | Verificar el JID exacto en los logs de Evolution API |
| OpenAI devuelve error 401 | Credencial mal configurada | Revisar que el header es `Authorization: Bearer sk-...` |
| Web devuelve `ok: false` | `WEBHOOK_SECRET` no coincide | Verificar que `$vars.WEBHOOK_SECRET` == `WEBHOOK_SECRET` en `.env.local` |
| Evolution API devuelve 404 | URL o instancia incorrecta | Verificar `EVOLUTION_API_URL` y `EVOLUTION_INSTANCE` |
| `data.message.conversation` es undefined | El mensaje no es de texto plano | Comprobar también `data.message.extendedTextMessage.text` |
