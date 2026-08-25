import { useState } from 'react';
import { AuthModals } from './AuthModals';

export function Header() {
  const [activeModal, setActiveModal] = useState<'login' | 'register' | 'recover' | null>(null);

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-300 w-12 h-12 rounded-md"></div>
          <h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
        </div>
        
        <button 
          onClick={() => setActiveModal('login')}
          className="px-4 py-2 rounded-md bg-surface text-text shadow-sm font-medium border border-opacity-20 border-text hover:bg-primary hover:text-white transition"
        >
          Login
        </button>
      </header>

      {/* Renderiza os modais de autenticação passando os controles de estado */}
      <AuthModals activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}