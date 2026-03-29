import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase'

const MenuDiaSchema = z.object({
  tipo: z.literal('menu_dia'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),
  primeros: z.array(z.string().min(1)).min(1, 'Debe haber al menos un primer plato'),
  segundos: z.array(z.string().min(1)).min(1, 'Debe haber al menos un segundo plato'),
  postre: z.string().nullable().optional(),
  precio: z.number().positive('El precio debe ser positivo'),
})

const PaellaSchema = z.object({
  tipo: z.literal('paella'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),
  tipo_paella: z.string().min(1, 'El tipo de paella es obligatorio'),
  precio: z.number().positive('El precio debe ser positivo'),
  plazas_disponibles: z.number().int().nullable().optional(),
  hora_recogida: z.string().nullable().optional(),
})

const WebhookSchema = z.discriminatedUnion('tipo', [MenuDiaSchema, PaellaSchema])

export async function POST(request: NextRequest) {
  // 1. Validar autenticación
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })
  }

  // 2. Parsear body
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON inválido' }, { status: 400 })
  }

  // 3. Validar schema con Zod
  const result = WebhookSchema.safeParse(rawBody)
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: 'Datos inválidos', detalles: result.error.flatten() },
      { status: 400 },
    )
  }

  const payload = result.data

  try {
    const supabase = createServerClient()

    if (payload.tipo === 'menu_dia') {
      const { error } = await supabase.from('menu_dia').upsert(
        {
          fecha: payload.fecha,
          primeros: payload.primeros,
          segundos: payload.segundos,
          postre: payload.postre ?? null,
          precio: payload.precio,
          activo: true,
        },
        { onConflict: 'fecha' },
      )

      if (error) {
        console.error('[webhook] Error upserting menu_dia:', error)
        return NextResponse.json(
          { ok: false, error: 'Error guardando el menú en la base de datos' },
          { status: 500 },
        )
      }
    } else {
      const { error } = await supabase.from('paellas').upsert(
        {
          fecha: payload.fecha,
          tipo: payload.tipo_paella,
          precio: payload.precio,
          plazas_disponibles: payload.plazas_disponibles ?? null,
          hora_recogida: payload.hora_recogida ?? null,
          activo: true,
        },
        { onConflict: 'fecha' },
      )

      if (error) {
        console.error('[webhook] Error upserting paellas:', error)
        return NextResponse.json(
          { ok: false, error: 'Error guardando la paella en la base de datos' },
          { status: 500 },
        )
      }
    }

    // 4. Invalidar caché de Next.js
    revalidatePath('/')

    // 5. Respuesta
    return NextResponse.json({ ok: true, tipo: payload.tipo, fecha: payload.fecha })
  } catch (err) {
    console.error('[webhook] Error inesperado:', err)
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
