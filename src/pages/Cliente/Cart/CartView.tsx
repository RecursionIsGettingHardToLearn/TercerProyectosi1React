// src/pages/Cart/CartView.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'

const CartView: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0)
    return <p className="p-4">No hay productos en el carrito.</p>

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Tu Carrito</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Producto</th>
            <th className="px-2 py-1 border">Cantidad</th>
            <th className="px-2 py-1 border">Precio u.</th>
            <th className="px-2 py-1 border">Subtotal</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ producto, precioUnitario, quantity }) => (
            <tr key={producto.id}>
              <td className="px-2 py-1 border">{producto.nombre}</td>
              <td className="px-2 py-1 border">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e =>
                    updateQuantity(producto.id, Number(e.target.value))
                  }
                  className="w-16 border rounded"
                />
              </td>
              <td className="px-2 py-1 border">{precioUnitario}</td>
              <td className="px-2 py-1 border">
                {(quantity * precioUnitario)}
              </td>
              <td className="px-2 py-1 border">
                <button
                  onClick={() => removeItem(producto.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl">Total: {total}</p>
        <div className="space-x-2">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Vaciar
          </button>
          <button
            onClick={() => navigate('/cliente/checkout')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartView
