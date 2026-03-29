import 'server-only'
import { createBrowserClient } from '@/lib/supabase'
import type { MenuDia, Paella } from '@/lib/types'
import { getTodayMadrid } from '@/lib/utils'

export async function getMenuDelDia(): Promise<MenuDia | null> {
  const today = getTodayMadrid()
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('menu_dia')
    .select('*')
    .eq('fecha', today)
    .eq('activo', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No hay menú para hoy — es un estado normal, no un error
      return null
    }
    console.error('[supabase] Error fetching menu_dia:', error)
    return null
  }

  return data as MenuDia
}

export async function getPaellaHoy(): Promise<Paella | null> {
  const today = getTodayMadrid()
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from('paellas')
    .select('*')
    .eq('fecha', today)
    .eq('activo', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('[supabase] Error fetching paellas:', error)
    return null
  }

  return data as Paella
}
