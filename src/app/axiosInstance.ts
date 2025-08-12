// src/app/axiosInstance.ts
import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { refreshToken as apiRefreshToken } from '../api/auth'
import { navigateTo } from './navigator'

// Base instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
})

// ====== Manejo de refresh con “cola” para evitar múltiples refresh en paralelo ======
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function processQueue(newToken: string | null) {
  pendingQueue.forEach(cb => cb(newToken))
  pendingQueue = []
}

function setAuthHeader(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common.Authorization
  }
}

// Util para garantizar AxiosHeaders sin chocar con tipos parciales
function ensureAxiosHeaders(h?: unknown): AxiosHeaders {
  if (h instanceof AxiosHeaders) return h
  const headers = new AxiosHeaders()
  if (h) headers.set(h as any) // mezcla llano/Raw en AxiosHeaders
  return headers
}

// Request: pone Authorization si hay token en localStorage
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = localStorage.getItem('access')
  if (access) {
    const headers = ensureAxiosHeaders(config.headers)
    headers.set('Authorization', `Bearer ${access}`)
    config.headers = headers
  }
  return config
})

// Response: reintenta una sola vez tras refresh en 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean })
    const status = error.response?.status

    // Si no es 401 o ya reintentamos, propaga el error
    if (status !== 401 || originalRequest?._retry) {
      throw error
    }

    // Marcamos para evitar loops infinitos
    originalRequest._retry = true

    const refresh = localStorage.getItem('refresh')
    if (!refresh) {
      // No hay refresh → cerrar sesión
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      setAuthHeader(null)
      navigateTo('/login', { replace: true })
      throw error
    }

    // Si ya hay un refresh en curso, encolamos el reintento
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) {
            reject(error)
            return
          }
          // Reintenta con el token nuevo
          const headers = ensureAxiosHeaders(originalRequest.headers)
          headers.set('Authorization', `Bearer ${newToken}`)
          originalRequest.headers = headers
          resolve(axiosInstance(originalRequest))
        })
      })
    }

    // Lanzamos refresh
    isRefreshing = true
    try {
      const newAccess = await apiRefreshToken(refresh) // POST /token/refresh/
      localStorage.setItem('access', newAccess)
      setAuthHeader(newAccess)
      processQueue(newAccess)

      // Reintenta la original con el nuevo token
      const headers = ensureAxiosHeaders(originalRequest.headers)
      headers.set('Authorization', `Bearer ${newAccess}`)
      originalRequest.headers = headers

      return axiosInstance(originalRequest)
    } catch (e) {
      // Refresh falló → limpiar sesión y mandar a login
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      setAuthHeader(null)
      processQueue(null)
      navigateTo('/login', { replace: true })
      throw e
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance
