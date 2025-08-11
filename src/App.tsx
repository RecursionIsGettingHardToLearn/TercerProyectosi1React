import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import  Login  from './pages/Login';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdministradorRoutes from './routes/AdministradorRoutes';
import CajeroRoutes from './routes/CajeroRoutes';
import ClienteRoutes from './routes/ClienteRoutes';
import RepartidorRoutes from './routes/RepartidorRoutes';

import Sidebar from './components/Layout/Sidebar';
import Welcome from './pages/welcom';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './contexts/CartContext';
import PublicRoute from './components/PublicRoute';

// Layout protegido con Sidebar único
const LayoutWithSidebar = () => {
  const { user } = useAuth();
  if (!user) return null; // o un spinner
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />


          {/* protegidas con layout */}
          <Route element={<ProtectedRoute><LayoutWithSidebar /></ProtectedRoute>}>
            <Route
              path="/administrador/*"
              element={
                <ProtectedRoute requiredRoles={['Administrador']}>
                  <AdministradorRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cajero/*"
              element={
                <ProtectedRoute requiredRoles={['Cajero']}>
                  <CajeroRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repartidor/*"
              element={
                <ProtectedRoute requiredRoles={['Repartidor']}>
                  <RepartidorRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cliente/*"
              element={
                <ProtectedRoute requiredRoles={['Cliente']}>
                  {/* Carrito SOLO en Cliente */}
                  <CartProvider>
                    <ClienteRoutes />
                  </CartProvider>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* errores */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
