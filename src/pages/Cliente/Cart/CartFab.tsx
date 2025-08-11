import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'


import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../../contexts/CartContext'
import { useAuth } from '../../../contexts/AuthContext'
const CartFab: React.FC = () => {
  const { user } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Solo visible para Cliente
  const isCliente = user?.rol?.nombre === 'Cliente'
  if (!isCliente) return null

  // Ocultar si carrito vacío
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  if (count === 0) return null

  // (Opcional) ocultar en checkout
  if (pathname.startsWith('/cliente/checkout')) return null

  return (
    <button
      aria-label="Ver carrito"
      onClick={() => navigate('/cliente/cart')}
      className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
    >
      <FaShoppingCart />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    </button>
  )
}

export default CartFab
