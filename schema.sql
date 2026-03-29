-- ============================================================
-- Bar A Pedralba — Schema Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Tabla: menu_dia ─────────────────────────────────────────
create table if not exists menu_dia (
  id          uuid        default gen_random_uuid() primary key,
  fecha       date        not null unique,
  primeros    text[]      not null default '{}',
  segundos    text[]      not null default '{}',
  postre      text,
  precio      numeric(5,2) not null,
  activo      boolean     not null default true,
  created_at  timestamptz not null default now()
);

comment on table menu_dia is 'Menú del día. Un registro por fecha.';
comment on column menu_dia.primeros is 'Array de platos de primero';
comment on column menu_dia.segundos is 'Array de platos de segundo';
comment on column menu_dia.activo is 'Si false, no se muestra en la web';

-- ── Tabla: paellas ───────────────────────────────────────────
create table if not exists paellas (
  id                  uuid        default gen_random_uuid() primary key,
  fecha               date        not null unique,
  tipo                text        not null,
  precio              numeric(5,2) not null,
  plazas_disponibles  integer,
  hora_recogida       text,
  activo              boolean     not null default true,
  created_at          timestamptz not null default now()
);

comment on table paellas is 'Paellas disponibles. Un registro por fecha.';
comment on column paellas.tipo is 'Descripción: "Paella valenciana", "Arroz negro"…';
comment on column paellas.plazas_disponibles is 'null = sin límite';
comment on column paellas.hora_recogida is 'Ejemplo: "14:00"';

-- ── Tabla: config ────────────────────────────────────────────
create table if not exists config (
  id      uuid  default gen_random_uuid() primary key,
  clave   text  not null unique,
  valor   text  not null
);

comment on table config is 'Configuración clave-valor del bar, editable desde Supabase sin tocar el código.';

-- ── Row Level Security ────────────────────────────────────────
alter table menu_dia  enable row level security;
alter table paellas   enable row level security;
alter table config    enable row level security;

-- Lectura pública solo de registros activos
create policy "Lectura pública menu_dia activos"
  on menu_dia for select
  using (activo = true);

create policy "Lectura pública paellas activas"
  on paellas for select
  using (activo = true);

create policy "Lectura pública config"
  on config for select
  using (true);

-- Las escrituras las hace el webhook con la service_role key (bypassa RLS)

-- ── Datos de prueba (opcional, comentar en producción) ────────
-- insert into menu_dia (fecha, primeros, segundos, postre, precio)
-- values (
--   current_date,
--   array['Ensalada mixta', 'Caldo gallego'],
--   array['Merluza a la plancha', 'Pollo asado con patatas'],
--   'Flan casero',
--   12.50
-- );

-- insert into paellas (fecha, tipo, precio, plazas_disponibles, hora_recogida)
-- values (
--   current_date,
--   'Paella mixta',
--   14.00,
--   20,
--   '14:00'
-- );
