
// src/routes/ClientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Cliente/Dashboard';
import ProductoList from '../pages/Cliente/ProductoList';
import CartView from '../pages/Cliente/Cart/CartView';
import Checkout from '../pages/Cliente/Cart/Checkout';
import CartFab from '../pages/Cliente/Cart/CartFab';


const ClientRoutes: React.FC = () => (
  <ProtectedRoute requiredRoles={["Cliente"]}>
    <>
      <CartFab />
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* sub-rutas */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="productos" element={<ProductoList />} />
        <Route path="cart" element={<CartView />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  </ProtectedRoute>
);

export default ClientRoutes;
