// src/api/auth.ts
import axiosInstance from '../app/axiosInstance'
interface TokenResponse
{
  access:string;
  refresh:string;
}

export async function login(
  username: string,
  password: string
  ):
   Promise<TokenResponse> 
  {
  const {data} =  await axiosInstance.post<TokenResponse>('/token/', { username, password });
  return data
}

export function setEncabezado(token: string) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
}

export async function logoutAPI(refresh: string): Promise<void> {
  await axiosInstance.post('/logout/', { refresh })
}

export async function refreshAccess(refresh: string): Promise<Partial<TokenResponse>> {
  // SimpleJWT devuelve {access} y si rotas, {access, refresh}
  const { data } = await axiosInstance.post<Partial<TokenResponse>>('/token/refresh/', { refresh })
  return data
}