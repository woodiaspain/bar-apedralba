export interface MenuDia {
  id: string
  fecha: string
  primeros: string[]
  segundos: string[]
  postre: string | null
  precio: number
  activo: boolean
  created_at: string
}

export interface Paella {
  id: string
  fecha: string
  tipo: string
  precio: number
  plazas_disponibles: number | null
  hora_recogida: string | null
  activo: boolean
  created_at: string
}

export interface Config {
  id: string
  clave: string
  valor: string
}
