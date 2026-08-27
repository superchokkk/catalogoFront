import { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { AuthModal } from './components/AuthModals';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAdmin, logout, login, carregandoSessao } = useAuth();

  // Evita mostrar "Login" por um instante antes de sabermos se já existe sessão ativa.
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
          isAdmin={isAdmin}
          onLogout={logout}
        />
        <Catalog />
      </main>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(user) => login(user)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;