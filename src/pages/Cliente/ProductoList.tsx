// src/pages/Store/ProductoList.tsx
import React, { useEffect, useState } from 'react'
import { fetchProductos, fetchInventarios } from '../../api/api'
import { useCart } from '../../contexts/CartContext'
import type { Producto, Inventario } from '../../types'
import { toast } from 'react-toastify'
const ProductoList: React.FC = () => {
  const [productos, setProductos]     = useState<Producto[]>([])
  const [inventarios, setInventarios] = useState<Inventario[]>([])
  const [qtyByInv, setQtyByInv]       = useState<Record<number, number>>({})
  const { addItem }                   = useCart()

  useEffect(() => {
    fetchProductos().then(setProductos)
    fetchInventarios().then(setInventarios)
  }, [])

  // Devuelve el nombre del producto dado su id
  const getNombre = (pid: number) =>
    productos.find(p => p.id === pid)?.nombre ?? '—'

  const handleQtyChange = (invId: number, v: string) => {
    const n = Math.max(1, parseInt(v) || 1)
    setQtyByInv(q => ({ ...q, [invId]: n }))
  }

  const handleAdd = (inv: Inventario) => {
    const qty = qtyByInv[inv.id] ?? 1
    const prod: Producto = { id: inv.producto, nombre: getNombre(inv.producto) }
    addItem(prod, inv.precio, qty);
    toast.success(
    `${prod.nombre} x${qty} añadido${qty > 1 ? 's' : ''} al carrito`
  )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Catálogo</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Producto</th>
            <th className="px-2 py-1 border">Precio</th>
            <th className="px-2 py-1 border">Stock</th>
            <th className="px-2 py-1 border">Cantidad</th>
            <th className="px-2 py-1 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.map(inv => (
            <tr key={inv.id}>
              <td className="px-2 py-1 border">{getNombre(inv.producto)}</td>
              <td className="px-2 py-1 border">{inv.precio}</td>
              <td className="px-2 py-1 border">{inv.stock}</td>
              <td className="px-2 py-1 border">
                <input
                  type="number"
                  min={1}
                  value={qtyByInv[inv.id] ?? 1}
                  onChange={e => handleQtyChange(inv.id, e.target.value)}
                  className="w-16 border rounded"
                />
              </td>
              <td className="px-2 py-1 border">
                <button
                  onClick={() => handleAdd(inv)}
                  className="px-2 py-1 bg-green-600 text-white rounded"
                  disabled={inv.stock < (qtyByInv[inv.id] ?? 1)}
                >
                  Agregar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductoList
