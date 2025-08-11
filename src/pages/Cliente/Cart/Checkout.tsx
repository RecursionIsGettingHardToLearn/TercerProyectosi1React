// src/pages/Cliente/Cart/Checkout.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import { createPedido, } from '../../../api/api'
import type { PedidoDto, } from '../../../api/api'
import { useAuth } from '../../../contexts/AuthContext'

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [direccion, setDireccion] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      console.error('Usuario no autenticado')
      return
    }

    const pedidoDto: PedidoDto = {
      fecha: new Date().toISOString(),
      total,
      direccion,
      detallepedidos: items.map(i => ({
        producto: i.producto.id,
        cantidad: i.quantity,
        precio_unitario: i.precioUnitario,
        subtotal: i.quantity * i.precioUnitario
      }))
    }

    try {
      await createPedido(pedidoDto)
      clearCart()
      navigate('/cliente/productos')
    } catch (err) {
      console.error('Error al crear pedido', err)
    }
  }

  return (
    <div className="p-4 max-w-md">
      <h2 className="text-2xl mb-4">Confirmar Pedido</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Dirección de entrega</label>
          <textarea
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Finalizar (${total.toFixed(2)})
        </button>
      </form>
    </div>
  )
}

export default Checkout
