import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
    // Como o token vive num cookie httpOnly, o JS não consegue ler nem decodificar.
    // A única forma de saber "quem está logado" após um F5 é perguntar ao backend.
    // ATENÇÃO: ajuste a URL abaixo se a rota "quem sou eu" tiver outro caminho no seu NestJS.
    fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((dados) => {
        if (dados?.user) setUser(dados.user);
      })
      .catch(() => {
        // Sem sessão ativa (ou rota ainda não existe) — segue como deslogado, sem quebrar o app.
      })
      .finally(() => setCarregandoSessao(false));
  }, []);

  const isAdmin = user?.nivel === 0 || user?.nivel === 1;

  const login = (novoUser: User) => setUser(novoUser);

  const logout = () => {
    // ATENÇÃO: ajuste a URL abaixo conforme a rota real de logout do seu backend.
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
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