import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuItemsByRole } from '../../config/menuConfig';
import { useCart } from '../../contexts/CartContext'
const Sidebar: React.FC = () => {
  const { user, signout } = useAuth();
  const role = user?.rol?.nombre;
  const back = useNavigate();
  const { items } = useCart()
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0)
  const menuItems = role && menuItemsByRole[role as keyof typeof menuItemsByRole] || [];

  return (
    <div className="bg-red-800 text-white w-64 h-screen flex flex-col">
      <div className="p-4 text-xl font-bold">Home</div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            {item.label}
            {item.to === '/cliente/cart' && totalQty > 0 && (
              <span className="…">{totalQty}</span>
            )}
          </NavLink>
        ))}

      </nav>
      <button
        onClick={
          () => {
            signout();
            back('/login');
          }
        }
        className="m-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"

      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
