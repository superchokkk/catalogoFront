import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiFetch, registrarSessaoExpirada } from '../lib/api';

export type User = {
  id: string;
  nome: string;
  email: string;
  nivel: number;
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  /** true enquanto tentamos restaurar a sessão a partir do cookie, ao carregar a página */
  carregandoSessao: boolean;
  /** Chamado pelo AuthModal depois de um login/cadastro bem-sucedido, com o user retornado pelo backend */
  login: (user: User) => void;
  /** Avisa o backend para limpar o cookie e limpa o estado local */
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    // O token vive em cookie httpOnly; após um F5 só o backend sabe quem está logado.
    // GET /auth/me devolve o próprio objeto do usuário (sem o envelope success/message).
    apiFetch('/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (dados?.id) {
          setUser({ id: dados.id, nome: dados.nome, email: dados.email, nivel: dados.nivel });
        }
      })
      .catch(() => {
        // Sem sessão ativa — segue como deslogado.
      })
      .finally(() => setCarregandoSessao(false));

    // Se o refresh falhar numa rota autenticada, a sessão acabou.
    registrarSessaoExpirada(() => setUser(null));
    return () => registrarSessaoExpirada(null);
  }, []);

  const isAdmin = user?.nivel === 0 || user?.nivel === 1;

  const login = (novoUser: User) => setUser(novoUser);

  const logout = () => {
    apiFetch('/auth/logout', { method: 'POST' }, true).catch(() => {
      // Mesmo se a chamada falhar, ainda limpamos o estado local abaixo.
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, carregandoSessao, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>');
  }
  return ctx;
}