import React from 'react';
import { theme } from '../theme';

interface HeaderProps {
  onOpenAuth: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, isAdmin, onLogout }) => {
  
  return (
    <header className="p-4 flex justify-between">
      <img src={theme.logo} alt="Logo do Catálogo" className="border border-gray-300 h-12 w-auto" />
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">{theme.name}</h1>
        <nav>
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <span className="text-green-400 font-semibold">Admin</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};