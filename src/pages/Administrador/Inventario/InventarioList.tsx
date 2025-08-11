// src/pages/Admin/Inventario/InventarioList.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInventarios, deleteInventario, fetchProductos } from '../../../api/api'
import type { Inventario,Producto } from '../../../types'

const InventarioList: React.FC = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([])
  const [productos, setProducto] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  const loadInventarios = async () => {
    try {
      setLoading(true)
      const data = await fetchInventarios()
      setInventarios(data)
    } catch (error) {
      console.error('Error al cargar inventarios', error)
    } finally {
      setLoading(false)
    }
  }
 
   const loadProductos = async () => {
    try {
      const data = await fetchProductos()
      setProducto(data)
    } catch (error) {
      console.error('Error al cargar Prodiuctos', error)
    } 
  }

  useEffect(() => {
    loadInventarios();
    loadProductos();
  }, [])

  const handleEdit = (id: number) => {
    navigate(`/administrador/inventarios/${id}/edit`)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este inventario?')) {
      try {
        await deleteInventario(id)
        loadInventarios()
      } catch (error) {
        console.error('Error al eliminar inventario', error)
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Inventarios</h2>
        <button
          onClick={() => navigate('/administrador/inventarios/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Inventario
        </button>
      </div>

      {loading ? (
        <p>Cargando inventarios...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarios.map(i => (
              <tr key={i.id}>
                <td className="px-4 py-2 border">{i.id}</td>
                <td className="px-4 py-2 border">{productos.find((p)=>p.id==i.producto)?.nombre}</td>
                <td className="px-4 py-2 border">{i.precio}</td>
                <td className="px-4 py-2 border">{i.stock}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(i.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(i.id)}
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

export default InventarioList
