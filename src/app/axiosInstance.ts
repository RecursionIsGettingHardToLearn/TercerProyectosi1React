// src/app/axiosInstance.ts
import axios, { AxiosError } from 'axios'
import type{ AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { toUiError } from '../api/error'
import { navigateTo } from './navigator'

// Usa .env si existe, y sino cae a tu URL local
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({ baseURL })

// —— Request: adjuntar access token ——
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access')
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// —— Refresh simple anti-loop ——
let isRefreshing = false
let pending: Array<(token: string | null) => void> = []
const onRefreshed = (token: string | null) => {
  pending.forEach(cb => cb(token))
  pending = []
}

async function tryRefreshToken(): Promise<string | null> {
  if (isRefreshing) {
    // Esperar a que termine el refresh en curso
    return new Promise((resolve) => {
      pending.push(resolve)
    })
  }

  isRefreshing = true
  try {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return null

    // Llama a tu endpoint de refresh; ajusta ruta si difiere
    const { data } = await axios.post(`${baseURL}/token/refresh/`, { refresh })
    const newAccess = data?.access
    if (newAccess) {
      localStorage.setItem('access', newAccess)
      onRefreshed(newAccess)
      return newAccess
    }
    return null
  } catch {
    onRefreshed(null)
    return null
  } finally {
    isRefreshing = false
  }
}

// —— Response: manejo de errores + refresh ——
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean })
    const ui = toUiError(error)
    const status = ui.status

    // 401: intentamos refresh 1 vez
    if (status === 401 && !original?._retry) {
      const newAccess = await tryRefreshToken()
      if (newAccess) {
        original._retry = true
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` }
        return api(original) // reintenta la petición original con token nuevo
      }
      // refresh falló → limpiar y llevar a login
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      toast.info('Tu sesión expiró. Vuelve a iniciar sesión.')
      navigateTo('/login', { replace: true })
      return Promise.reject(error)
    }

    // 403, 404, 5xx → navegación/mensajes
    if (status === 403) {
      navigateTo('/forbidden', { replace: true })
    } else if (status === 404) {
      navigateTo('/not-found', { replace: true })
    } else if (status && status >= 500) {
      toast.error('Error del servidor. Intenta más tarde.')
    } else if (ui.message) {
      // Para cualquier otro error manejable (p.ej. validación)
      // No tostees en formularios si los muestras inline; usa esto para pantallas no-form
      // toast.error(ui.message)
    }

    return Promise.reject(error)
  }
)

export default api
