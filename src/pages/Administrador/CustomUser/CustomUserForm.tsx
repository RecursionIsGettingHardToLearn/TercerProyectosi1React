
// src/pages/Admin/Users/CustomUserForm.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchRoles } from '../../../api/api'
import { fetchUsuario, createUsuario, updateUsuario }
  from '../../../types/user'

import type { CustomUserResponse }
  from '../../../types/user'

import { toUiError } from '../../../api/error'
import type { Rol } from '../../../types/index'

interface UserFormState {
  username: string;
  password: string;
  rol: number | null;
}

const CustomUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()


  const [form, setForm] = useState<UserFormState>({ username: '', password: '', rol: null })
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [topError, setTopError] = useState<string>('')
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  useEffect(() => {
    // cargar lista de roles para el select
    fetchRoles()
      .then(setRoles)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      fetchUsuario(+id)
        .then((u: CustomUserResponse) => {
          setForm({
            username: u.username,
            password: '',
            rol: u.rol?.id ?? null,
          })
        })
        .catch((err) => {
          const { message, fields } = toUiError(err)
          setTopError(message)
          if (fields) setFormErrors(fields) 
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'rol' ? (value ? Number(value) : null) : value
    }))
  }

  // 1) catch del submit: setTopError / setFormErrors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTopError('')
    setFormErrors({})
    try {
      if (isEdit && id) {
        // 2) construir payload sin campos extra ni password vacía
        const payload: {
          username: string;
          rol: number | null;
          password?: string
        } = {
          username: form.username,
          rol: form.rol
        }
        if (form.password && form.password.trim().length > 0) {
          payload.password = form.password
        }
        await updateUsuario(+id, payload)
      } else {
        const payload = {
          username: form.username,
          password: form.password,
          rol: form.rol
        }
        await createUsuario(payload)
      }
      navigate('/administrador/usuarios')
    } catch (err) {
      const { message, fields } = toUiError(err)
      setTopError(message)
      if (fields) setFormErrors(fields)   // <- ahora sí se ven en el form
    }
  }

  return (
    <div >
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'EditarUsuario' : 'Crear Usuario'}
      </h2>
      {topError && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {topError}
        </div>
      )}



      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
            {formErrors.username?.map((m, i) => (
              <p key={i} className="text-xs text-red-600 mt-1">{m}</p>
            ))}
          </div>

          <div>
            <label className="block mb-1">Password{isEdit ? ' (dejar en blanco para no cambiar)' : ''}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required={!isEdit}
            />
            {formErrors.password?.map((m, i) => (
              <p key={i} className="text-xs text-red-600 mt-1">{m}</p>
            ))}
          </div>


          <div>
            <label className="block mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol ?? ''}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">-- Seleccione un rol --</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
            {formErrors.rol?.map((m, i) => (
              <p key={i} className="text-xs text-red-600 mt-1">{m}</p>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate('/administrador/usuarios')}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CustomUserForm
