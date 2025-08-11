
// src/pages/Admin/Inventario/InventarioForm.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchInventario, createInventario, updateInventario, fetchProductos } from '../../../api/api'
import type { Inventario, Producto } from '../../../types'

interface InventarioFormDto {
  producto: number
  precio: number
  stock: number
}

const InventarioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<InventarioFormDto>({ producto: 0, precio: 0, stock: 0 })
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // cargar lista de productos para el select
    fetchProductos()
      .then(setProductos)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      fetchInventario(+id)
        .then((inv: Inventario) => {
          setForm({ 
                producto: inv.producto,
                precio: inv.precio,
                stock: inv.stock
             })
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'producto' ? Number(value) : Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateInventario(+id, form)
      } else {
        await createInventario(form)
      }
      navigate('/administrador/inventarios')
    } catch (error) {
      console.error('Error al guardar inventario', error)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar Inventario' : 'Nuevo Inventario'}
      </h2>

      {loading ? (
        <p>Cargando datos…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1">Producto</label>
            <select
              name="producto"
              value={form.producto}
              onChange={handleChange}
              required
              className="w-full border px-2 py-1 rounded"
            >
              <option value={0}>-- Seleccione un producto --</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
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
              onClick={() => navigate('/administrador/inventarios')}
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

export default InventarioForm
