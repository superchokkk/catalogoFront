import React from 'react';
import { theme } from '../theme';
import type { User } from '../context/AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onLogout: () => void;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onLogout, user }) => {
  return (
    <header className="p-4 flex justify-between">
      <img src={theme.logo} alt="Logo do Catálogo" className="border border-gray-300 h-12 w-auto" />
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">{theme.name}</h1>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">
                Olá, {user.nome}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded transition"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};