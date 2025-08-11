// src/pages/Admin/Products/ProductoList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProductos, deleteProducto } from '../../../api/api'
import type { Producto } from '../../../types'

const ProductoList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const loadProductos = async () => {
    try {
      setLoading(true)
      const data = await fetchProductos()
      setProductos(data)
    } catch (error) {
      console.error('Error al cargar productos', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProductos()
  }, [])

  const handleEdit = (id: number) => {
    navigate(`/administrador/productos/${id}/edit`)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await deleteProducto(id)
        loadProductos()
      } catch (error) {
        console.error('Error al eliminar producto', error)
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Productos</h2>
        <button
          onClick={() => navigate('/administrador/productos/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Producto
        </button>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{p.nombre}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProductoList