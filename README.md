# Bar A Pedralba

Web oficial del Bar A Pedralba, pizzería & bar del Club de Tenis A Pedralba en Bergondo, Galicia.

## Stack

- **Next.js 14** (App Router) + TypeScript estricto
- **Tailwind CSS** — diseño 100% custom, sin librerías de componentes
- **Supabase** (PostgreSQL) — menú del día y paellas dinámicos
- **n8n** + **Evolution API** — actualización del menú vía WhatsApp
- **Vercel** — deploy y CDN

## Setup local

### 1. Prerequisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [Vercel](https://vercel.com) para el deploy

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crear el fichero `.env.local` en la raíz (ya existe con placeholders):

```bash
NEXT_PUBLIC_SUPABASE_URL=        # Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Settings > API > anon public
SUPABASE_SERVICE_ROLE_KEY=       # Settings > API > service_role
WEBHOOK_SECRET=                  # Generar con: openssl rand -hex 32
```

### 4. Configurar Supabase

1. Crear un proyecto nuevo en [Supabase](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `schema.sql`
3. Copiar las claves en `.env.local`

### 5. Arrancar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

La web cargará con mensajes de fallback en las secciones dinámicas (menú del día y paellas) si las tablas están vacías.

### 6. Insertar datos de prueba

En Supabase SQL Editor:

```sql
-- Menú del día de hoy
INSERT INTO menu_dia (fecha, primeros, segundos, postre, precio)
VALUES (
  CURRENT_DATE,
  ARRAY['Ensalada mixta', 'Caldo gallego'],
  ARRAY['Merluza a la plancha', 'Pollo asado con patatas'],
  'Flan casero',
  12.50
);

-- Paella de hoy
INSERT INTO paellas (fecha, tipo, precio, plazas_disponibles, hora_recogida)
VALUES (
  CURRENT_DATE,
  'Paella mixta',
  14.00,
  20,
  '14:00'
);
```

---

## Probar el webhook

Con el servidor de desarrollo activo:

```bash
# Actualizar menú del día
curl -X POST http://localhost:3000/api/webhook/menu \
  -H "Content-Type: application/json" \
  -H "x-api-key: <WEBHOOK_SECRET>" \
  -d '{
    "tipo": "menu_dia",
    "fecha": "2026-03-29",
    "primeros": ["Ensalada mixta", "Caldo gallego"],
    "segundos": ["Merluza a la plancha", "Pollo asado"],
    "postre": "Flan casero",
    "precio": 12.50
  }'

# Respuesta esperada:
# {"ok":true,"tipo":"menu_dia","fecha":"2026-03-29"}
```

```bash
# Actualizar paella
curl -X POST http://localhost:3000/api/webhook/menu \
  -H "Content-Type: application/json" \
  -H "x-api-key: <WEBHOOK_SECRET>" \
  -d '{
    "tipo": "paella",
    "fecha": "2026-03-29",
    "tipo_paella": "Paella mixta",
    "precio": 14.00,
    "plazas_disponibles": 20,
    "hora_recogida": "14:00"
  }'
```

```bash
# Test sin autenticación → espera 401
curl -X POST http://localhost:3000/api/webhook/menu \
  -H "Content-Type: application/json" \
  -d '{"tipo":"menu_dia"}'
```

---

## Deploy en Vercel

### 1. Subir el código a GitHub

```bash
git init
git add .
git commit -m "Initial commit: Bar A Pedralba"
git remote add origin https://github.com/tu-usuario/bar-a-pedralba.git
git push -u origin main
```

### 2. Conectar con Vercel

1. Ir a [vercel.com](https://vercel.com) > **New Project**
2. Importar el repositorio de GitHub
3. En **Environment Variables**, añadir las 4 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBHOOK_SECRET`
4. Hacer click en **Deploy**

Vercel detectará Next.js automáticamente.

### 3. Verificar el deploy

```bash
curl -X POST https://bar-a-pedralba.vercel.app/api/webhook/menu \
  -H "Content-Type: application/json" \
  -H "x-api-key: <WEBHOOK_SECRET>" \
  -d '{
    "tipo": "menu_dia",
    "fecha": "2026-03-29",
    "primeros": ["Ensalada"],
    "segundos": ["Merluza"],
    "precio": 12.00
  }'
```

---

## Configurar n8n (integración WhatsApp)

Ver [N8N_SETUP.md](./N8N_SETUP.md) para la guía completa del flujo:

```
WhatsApp del dueño → Evolution API → n8n → IA (Claude/GPT) → webhook → web actualizada
```

---

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run typecheck  # Verificación de tipos TypeScript
npm run lint       # Linting con ESLint
```

---

## Estructura de carpetas

```
bar-a-pedralba/
├── app/
│   ├── layout.tsx              # Layout raíz (fuentes, metadata)
│   ├── page.tsx                # Landing principal
│   ├── globals.css             # Tailwind + variables CSS
│   └── api/webhook/menu/
│       └── route.ts            # POST endpoint para n8n
├── components/
│   ├── layout/                 # Header, Footer
│   ├── sections/               # HeroSection, MenuDia, Pizzas, Paellas…
│   └── ui/                     # SkeletonCard, Badge, SectionTitle
├── lib/
│   ├── types.ts                # Interfaces TypeScript
│   ├── supabase.ts             # Clientes Supabase (browser + server)
│   ├── utils.ts                # formatPrice, formatDate, getTodayMadrid
│   └── queries.ts              # getMenuDelDia, getPaellaHoy
├── schema.sql                  # SQL para ejecutar en Supabase
├── N8N_SETUP.md                # Guía del flujo n8n
└── .env.local                  # Variables de entorno (no subir al repo)
```
