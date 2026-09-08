import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import CartModal from './components/CartModal.jsx';
import Index from './pages/Index.jsx';
import QuienesSomos from './pages/quienes_s.jsx';
import Productos from './pages/productos.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import EmpleadoPanel from './pages/EmpleadoPanel.jsx';
import ClientePanel from './pages/ClientePanel.jsx';
import MiPerfil from './pages/MiPerfil.jsx';
import Modalregistrar from './components/Modalregistrar.jsx';
import RecuperarContrasena from './components/RecuperarContrasena.jsx';
import ServiciosPage from './pages/ServiciosPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

function MainApp() {
  const { currentUser, isAdmin, isEmpleado } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Modals visibility state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);

  // Apply light/dark class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsRecoverOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginOpen(false);
    setIsRecoverOpen(false);
    setIsRegisterOpen(true);
  };

  const handleOpenRecover = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsRecoverOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
      
      {/* Global Header with Role Awareness */}
      <Header
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route 
            path="/" 
            element={
              <Index 
                onOpenLogin={handleOpenLogin} 
                onOpenRegister={handleOpenRegister} 
              />
            } 
          />
          <Route path="/quienes_s" element={<QuienesSomos />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/productos" element={<Productos mode="productos" />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/contacto" element={<Contacto />} />

          
          {/* Panel Routes */}
          <Route 
            path="/admin" 
            element={
              isAdmin ? <AdminPanel /> : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/empleado" 
            element={
              (isEmpleado || isAdmin) ? <EmpleadoPanel /> : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/cliente" 
            element={
              currentUser ? <ClientePanel /> : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/perfil" 
            element={
              currentUser ? <MiPerfil /> : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/mi-perfil" 
            element={
              currentUser ? <MiPerfil /> : <Navigate to="/" replace />
            } 
          />


          <Route 
            path="/login" 
            element={
              <div className="py-8">
                <Login 
                  onOpenRegister={handleOpenRegister}
                  onOpenRecover={handleOpenRecover}
                  onLoginSuccess={() => setIsLoginOpen(false)}
                />
              </div>
            } 
          />
          <Route 
            path="/registro" 
            element={
              <Registro />
            } 
          />
          <Route 
            path="/recuperar-contrasena" 
            element={
              <div className="py-8">
                <RecuperarContrasena 
                  onReturnToLogin={handleOpenLogin} 
                />
              </div>
            } 
          />
          <Route 
            path="*" 
            element={
              <Index 
                onOpenLogin={handleOpenLogin} 
                onOpenRegister={handleOpenRegister} 
              />
            } 
          />
        </Routes>
      </main>

      {/* Reusable Floating WhatsApp Component (PDF Req #15) */}
      <WhatsAppButton />

      {/* Global Footer */}
      <Footer />

      {/* Global Cart Modal */}
      <CartModal />

      {/* Modal: Login Dialog */}
      {isLoginOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: 'rgba(4,2,16,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setIsLoginOpen(false)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <Login
              onOpenRegister={handleOpenRegister}
              onOpenRecover={handleOpenRecover}
              onLoginSuccess={() => setIsLoginOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Register Dialog */}
      <Modalregistrar
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={() => setIsRegisterOpen(false)}
      />

      {/* Modal: Password Recovery Dialog */}
      {isRecoverOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: 'rgba(4,2,16,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setIsRecoverOpen(false)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsRecoverOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <RecuperarContrasena
              onReturnToLogin={handleOpenLogin}
              onClose={() => setIsRecoverOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
