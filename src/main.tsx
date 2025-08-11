
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import AppErrorBoundary from './components/AppErrorBoundary'
createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </AppErrorBoundary>
)
