
// src/pages/Admin/Users/CustomUserForm.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchUsuario, createUsuario, updateUsuario, fetchRoles } from '../../../api/api'
import type { CustomUser, Rol } from '../../../types'
import { toUiError } from '../../../api/error'
interface UserFormDto {
  username: string
  password: string
  rol:number| null;
}interface UserFormState extends UserFormDto {
  passwordConfirm: string
}

const CustomUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  

  const [form, setForm] = useState<UserFormState>({ username: '', password: '', rol:null,passwordConfirm:''})
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState<boolean>(false)
   const [topError, setTopError] = useState<string>('') 
//const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
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
        .then((u: CustomUser) => {
          setForm({ 
             username:u.username,
             password: '',
             rol:u.rol?.id?? null,
            passwordConfirm:'' })
        })
        .catch((err)=>{
          const { message, fields } = toUiError(err)
                setTopError(message)
                if (fields) setFormErrors(fields) // { username: ['...'], password: ['...'] 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        // en edición, password vacía no se envía
        await updateUsuario(+id, form)
      } else {
        await createUsuario(form)
      }
      navigate('/administrador/usuarios')
    } catch (err) {
 console.log('ocurrio un error')
    }
  }

  return (
    <div >
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit?'EditarUsuario':'Crear Usuario'}
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
          </div>
          <div>
            <label >Ingrese la contraseña nuevamente</label>
            <input type="text"
            name="passwordconfirm"
            value={form.passwordConfirm} 
            />
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
