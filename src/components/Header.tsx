import React from 'react';

interface HeaderProps {
  onOpenAuth: () => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, isAdmin, onLogout }) => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider">DG Concept</h1>
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