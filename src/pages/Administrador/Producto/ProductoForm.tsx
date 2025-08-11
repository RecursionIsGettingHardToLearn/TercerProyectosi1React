
// src/pages/Admin/Products/ProductoForm.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProducto, createProducto, updateProducto } from '../../../api/api'
import type { Producto } from '../../../types'

interface ProductoFormDto {
  nombre: string
}

const ProductoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<ProductoFormDto>({ nombre: '' })
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      fetchProducto(+id)
        .then((p: Producto) => setForm({ nombre: p.nombre }))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ nombre: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateProducto(+id, form)
      } else {
        await createProducto(form)
      }
      navigate('/administrador/productos')
    } catch (error) {
      console.error('Error al guardar producto', error)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            />
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
              onClick={() => navigate('/administrador/productos')}
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

export default ProductoForm
