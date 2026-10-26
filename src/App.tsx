import { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import UpdatePassword from './pages/updatePass';
import { AuthModal } from './components/AuthModals';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout, login, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <p className="opacity-70">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Header
          onOpenAuth={() => setAuthOpen(true)}
          user={user}
          onLogout={logout}
        />
        <Catalog />
      </main>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(userData) => login(userData)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;