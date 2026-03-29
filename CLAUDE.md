# CLAUDE.md — Bar A Pedralba

> Documento vivo del proyecto. Actualízalo cada vez que se añada una tabla nueva, endpoint nuevo, variable de entorno, o decisión arquitectónica importante.

---

## 1. Descripción del proyecto

**Bar A Pedralba** es la web oficial del bar del Club de Tenis A Pedralba, en Bergondo (Galicia).

La web tiene dos funciones principales:
1. **Web informativa** — muestra horarios, contacto, menú del día y disponibilidad de paellas al público general.
2. **Sistema de actualización de menús vía WhatsApp** — el dueño del bar manda un mensaje de WhatsApp en lenguaje natural y el menú se actualiza automáticamente en la web sin necesidad de entrar a ningún panel.

### Datos del negocio

| Campo | Valor |
|---|---|
| Nombre | Bar A Pedralba |
| Club | Club de Tenis A Pedralba |
| Localización | Bergondo, Galicia |
| URL del club | https://tenisapedralba.es/ |
| Instagram | @bar_apedralba |
| Teléfono | +34 981 794 488 |
| Horario L-V | 16:00 – 23:00 |
| Horario S-D | 10:00 – 24:00 |

---

## 2. Stack técnico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG, route handlers, revalidación incremental |
| Lenguaje | TypeScript estricto | Seguridad de tipos end-to-end |
| Estilos | Tailwind CSS | Sin component libraries externas, diseño 100% custom |
| Animaciones | Framer Motion | Animaciones declarativas, whileInView, parallax, stagger |
| Base de datos | Supabase (PostgreSQL) | Auth futura, realtime si se necesita, SDK JS sencillo |
| Automatización | n8n | Orquesta el flujo WhatsApp → IA → webhook |
| WhatsApp | Evolution API | API de WhatsApp self-hosted compatible con n8n |
| Deploy | Vercel | Integración nativa con Next.js, previews automáticas |

---

## 3. Arquitectura de carpetas

> [PENDIENTE] — Se completará al inicializar el proyecto con `create-next-app`.

Estructura prevista:

```
bar-a-pedralba/
├── app/
│   ├── layout.tsx            # Layout raíz (fuentes, metadata global)
│   ├── page.tsx              # Landing principal
│   ├── globals.css           # Variables CSS + reset Tailwind
│   └── api/
│       └── webhook/
│           └── menu/
│               └── route.ts  # POST endpoint para n8n
├── components/
│   ├── ui/                   # Componentes genéricos (Button, Card…)
│   ├── sections/             # HeroSection, MenuDiaSection, PaellasSection, UbicacionSection…
│   └── layout/               # Header, Footer, Nav
├── lib/
│   ├── supabase.ts           # Cliente Supabase (server + client)
│   ├── types.ts              # Tipos TypeScript compartidos
│   └── utils.ts              # Helpers varios
├── public/                   # Imágenes estáticas, favicon
├── .env.local                # Variables de entorno (nunca al repo)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── claude.md                 # Este archivo
```

---

## 4. Variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto. **Nunca subir al repositorio.**

```bash
# ── Supabase ──────────────────────────────────────────────
# URL del proyecto Supabase (Settings > API > Project URL)
NEXT_PUBLIC_SUPABASE_URL=

# Clave anon pública de Supabase (Settings > API > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Clave service_role — solo en servidor, nunca en cliente
# (Settings > API > service_role) — tiene permisos totales, tratar como contraseña
SUPABASE_SERVICE_ROLE_KEY=

# ── Webhook ───────────────────────────────────────────────
# Clave secreta para autenticar las llamadas de n8n al webhook
# Generar con: openssl rand -hex 32
# n8n debe enviarla en el header: x-api-key: <valor>
WEBHOOK_SECRET=

# ── [PENDIENTE] Evolution API ─────────────────────────────
# URL de la instancia de Evolution API
EVOLUTION_API_URL=

# API key de Evolution API
EVOLUTION_API_KEY=

# ── [PENDIENTE] n8n ───────────────────────────────────────
# Configurado directamente en n8n, no en .env.local
# Documentar aquí la URL del webhook de n8n si se expone
```

---

## 5. Base de datos (Supabase)

### Flujo general de datos

```
WhatsApp (dueño)
  → Evolution API (recibe el mensaje)
  → n8n (workflow: parsea con IA, estructura los datos)
  → POST /api/webhook/menu (header x-api-key)
  → Supabase (upsert en tabla correspondiente)
  → revalidatePath('/') en Next.js
  → Web actualizada sin deploy
```

### Tabla `menu_dia`

Almacena el menú del día actual y el histórico.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid | PK, generado automáticamente |
| fecha | date | Fecha del menú. Único por día (unique constraint) |
| primeros | text[] | Array de platos de primero |
| segundos | text[] | Array de platos de segundo |
| postre | text | Postre del día (nullable) |
| precio | numeric(5,2) | Precio del menú completo en euros |
| activo | boolean | Si debe mostrarse en la web (default: true) |
| created_at | timestamptz | Fecha de inserción (default: now()) |

### Tabla `paellas`

Gestiona la disponibilidad de paellas (normalmente fin de semana).

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid | PK, generado automáticamente |
| fecha | date | Fecha de la paella |
| tipo | text | Descripción: "Paella valenciana", "Arroz negro"… |
| precio | numeric(5,2) | Precio por persona |
| plazas_disponibles | integer | Cuántas plazas quedan (nullable = sin límite) |
| activo | boolean | Si debe mostrarse en la web |
| created_at | timestamptz | Fecha de inserción |

### Tabla `config`

Clave-valor para configuración global del bar desde Supabase sin tocar el código.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid | PK |
| clave | text | Identificador único. Ej: `horario_verano`, `mensaje_bienvenida` |
| valor | text | Valor en texto plano o JSON string |

> **SQL de creación** — [PENDIENTE] añadir aquí las migraciones SQL una vez creadas en Supabase.

---

## 6. Endpoints de API

### `POST /api/webhook/menu`

Recibe los datos del menú estructurados desde n8n y los persiste en Supabase.

**Autenticación:** header `x-api-key: <WEBHOOK_SECRET>`

**Body esperado (menú del día):**
```json
{
  "tipo": "menu_dia",
  "fecha": "2026-03-29",
  "primeros": ["Ensalada mixta", "Caldo gallego"],
  "segundos": ["Merluza a la plancha", "Pollo asado"],
  "postre": "Flan casero",
  "precio": 12.50
}
```

**Body esperado (paella):**
```json
{
  "tipo": "paella",
  "fecha": "2026-03-30",
  "tipo_paella": "Paella mixta",
  "precio": 14.00,
  "plazas_disponibles": 20
}
```

**Respuesta exitosa:**
```json
{ "ok": true, "tipo": "menu_dia", "fecha": "2026-03-29" }
```

**Respuesta de error:**
```json
{ "ok": false, "error": "Descripción del error" }
```

**Comportamiento interno:**
1. Valida el header `x-api-key`
2. Parsea y valida el body (zod)
3. Hace upsert en Supabase (conflict on `fecha`)
4. Llama a `revalidatePath('/')` para invalidar la caché de Next.js
5. Devuelve respuesta JSON

> **[PENDIENTE]** Otros endpoints se documentarán aquí cuando se creen.

---

## 7. Flujo WhatsApp → Menú

### Paso a paso

1. **El dueño manda un WhatsApp** desde su móvil al número de Evolution API con el menú en lenguaje natural.
2. **Evolution API** recibe el mensaje y lo reenvía a un webhook de n8n.
3. **n8n** ejecuta el workflow:
   - Detecta si es un menú del día o una paella (por palabras clave o prompt de IA)
   - Envía el texto a un modelo de IA (Claude u OpenAI) con un prompt estructurado
   - La IA devuelve un JSON con los campos normalizados
4. **n8n llama al endpoint** `POST /api/webhook/menu` de la web con el JSON y la API key en el header.
5. **El route handler de Next.js** valida la request, hace upsert en Supabase y llama a `revalidatePath`.
6. **La web sirve los datos actualizados** en la siguiente petición sin necesidad de deploy.

### Ejemplos de mensajes válidos

**Menú del día:**
```
Hoy de primero ensalada y caldo. De segundo merluza o pollo.
Postre flan. Precio 12 euros
```

```
Menú: primeros caldo gallego y paté con tostadas.
Segundos lomo con pimientos o bacalao al horno. Sin postre. 11,50€
```

**Paellas:**
```
Este sábado hay paella mixta a 14€. Quedan 20 plazas
```

```
Domingo paella de marisco, 16 euros persona, plazas limitadas
```

> n8n debe ser tolerante con variaciones ortográficas, mayúsculas, abreviaturas y el dialecto gallego-castellano del dueño.

---

## 8. Decisiones de diseño

### Paleta de colores

| Nombre | Hex | Uso |
|---|---|---|
| Verde oscuro (principal) | `#1a3a2a` | Fondo header, acentos, CTAs |
| Verde medio | `#2d5a3d` | Hover states, secciones |
| Crema | `#f5f0e8` | Fondo principal, tarjetas |
| Tierra | `#8b6f47` | Texto secundario, bordes |
| Blanco roto | `#fafaf7` | Fondo alternativo |

### Tipografía

- **Títulos:** fuente serif elegante (ej. Playfair Display, Lora, o similar de Google Fonts)
- **Body:** fuente sans-serif legible (ej. Inter, Source Sans 3)
- **Escala:** base 16px, line-height 1.6 para texto largo

### Estética general

- Rústico-mediterráneo: texturas sutiles, nada de gradientes genéricos
- Sin animaciones innecesarias, pero transiciones suaves (200-300ms)
- Fotografías cálidas si se añaden (tonos dorados, naturales)
- Iconografía minimalista (Lucide o Heroicons)

### Mobile-first

El dueño gestiona todo desde el móvil. La web debe ser perfectamente usable en pantallas de 375px en adelante. El diseño desktop es una mejora progresiva, no el punto de partida.

---

## 9. Imágenes (Unsplash)

Todas las imágenes usan `next/image` con URLs directas de Unsplash (sin API key). El dominio `images.unsplash.com` está registrado en `next.config.mjs` bajo `images.remotePatterns`.

| Sección | URL | Uso |
|---|---|---|
| Hero background | `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80` | `fill` + `priority`, overlay `bg-brand-dark/55` |
| Sobre Nosotros | `/public/paella.png` (foto propia del bar, copiada de `IMG_7931.PNG`) | Imagen decorativa encima del bloque de horarios |
| Pizzas banner | `https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80` | Banner 200px encima del grid de pizzas |
| Paellas banner | `https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80` | Banner 200px encima de la tarjeta de paella |

---

## 10. Animaciones (Framer Motion)

### Patrón: Server Component + wrapper cliente

Los Server Components de datos (MenuDiaSection, PaellasSection) permanecen como server. Solo el wrapper visual es cliente.

```tsx
// Server Component — fetches data, passes children to client wrapper
import AnimatedSection from '@/components/ui/AnimatedSection'

export default async function MenuDiaSection() {
  const menu = await getMenuDelDia()
  return (
    <section>
      <AnimatedSection variant="fadeUp">
        {/* JSX estático pasado como children — válido en App Router */}
      </AnimatedSection>
    </section>
  )
}
```

### Componentes de animación disponibles

| Componente | Tipo | Uso |
|---|---|---|
| `AnimatedSection` | `use client` | Wrapper genérico: fadeUp, fadeLeft, fadeRight, fadeIn |
| `AnimatedPizzaGrid` | `use client` | Grid con stagger (0.08s) y hover lift para las pizzas |
| `StaggerList` | `use client` | Lista de platos con stagger (0.07s) en MenuDiaSection |
| `PageLoadOverlay` | `use client` | Overlay verde que hace fade out al cargar la página |

### Reglas

- Todos los `whileInView` usan `once: true` para que no se repitan al hacer scroll up.
- Respetar `prefers-reduced-motion` con `useReducedMotion()` de Framer Motion.
- Tipar los objetos de variantes con `Variants` de framer-motion para satisfacer el compilador TypeScript estricto.
- El Hero (`HeroSection.tsx`) es `use client` completo: tiene parallax scroll y stagger en la entrada.
- Las animaciones CSS puras (badge pulse, animate-bounce) están en `globals.css`, no en JS.

---

## 11. Convenciones de código

### TypeScript

- `strict: true` siempre. Prohibido el tipo `any`.
- Definir todos los tipos en `lib/types.ts` o junto al componente que los usa.
- Usar `zod` para validar el body de los webhooks en el servidor.

### Componentes Next.js

- **Server Components por defecto.** Solo añadir `'use client'` cuando haya interactividad real (onClick, useState, useEffect).
- Los datos se fetchen en el servidor y se pasan como props a los Client Components.
- Usar `loading.tsx` o Skeleton components para secciones dinámicas.

### Llamadas a Supabase

```typescript
// Siempre manejar el error — nunca ignorar { error }
const { data, error } = await supabase.from('menu_dia').select('*')
if (error) {
  console.error('[supabase] Error fetching menu:', error)
  throw new Error('No se pudo cargar el menú')
}
```

### Mutaciones y caché

- Después de toda mutación que afecte a la web pública, llamar a `revalidatePath('/')`.
- Si en el futuro hay rutas específicas de menú, revalidar también esas rutas.

### Estructura de un route handler

```typescript
// app/api/webhook/menu/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // 1. Validar auth
  // 2. Parsear y validar body (zod)
  // 3. Operar en Supabase
  // 4. revalidatePath
  // 5. Devolver respuesta tipada
}
```

---

## 12. Roadmap

### Fase 1 — Actual

- [x] Inicializar proyecto Next.js 14 + TypeScript + Tailwind
- [x] Crear schema Supabase (tablas `menu_dia`, `paellas`, `config`) — ver `schema.sql`
- [x] Implementar `POST /api/webhook/menu`
- [x] Landing informativa: hero, horarios, contacto, ubicación
- [x] Sección menú del día (datos desde Supabase)
- [x] Sección paellas del fin de semana
- [x] Workflow n8n: WhatsApp → IA → webhook — ver `N8N_SETUP.md`
- [ ] Deploy en Vercel

### Fase 2 — Futura

- [ ] Dashboard del dueño con autenticación (Supabase Auth)
- [ ] Analytics de ventas: platos más pedidos, días con más afluencia
- [ ] Ingeniería de menús: sugerencias basadas en historial
- [ ] Ley de Omnes: análisis de rentabilidad por plato
- [ ] Resumen diario por WhatsApp al dueño (n8n → Evolution API)
- [ ] Reservas online para paellas

---

## 13. Comandos útiles

> [PENDIENTE] — Se completará al inicializar el proyecto con `npm` o `pnpm`.

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## Instrucciones para Claude Code

1. **Si el proyecto tiene código**, explora la estructura antes de proponer cambios.
2. **Si se añade una tabla nueva** en Supabase, actualiza la sección 5 con columnas y tipos.
3. **Si se añade un endpoint nuevo**, documéntalo en la sección 6 con método, path, headers, body y respuesta.
4. **Si se añade una variable de entorno**, añádela en la sección 4 con su descripción.
5. **Nunca escribir valores reales** de secrets en este archivo.
6. **Al terminar una fase del roadmap**, marcar los ítems completados con `[x]`.
7. Este es un proyecto familiar español — comunicarse en español, nombres de variables en inglés.
