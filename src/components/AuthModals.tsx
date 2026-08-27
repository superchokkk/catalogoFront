import { useState, type FormEvent } from 'react';
import type { User } from '../context/AuthContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Chamado depois de um login (ou cadastro) bem-sucedido, com o user retornado pelo backend */
  onSuccess?: (user: User) => void;
};

type Tab = 'login' | 'cadastro';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Campos de login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Campos adicionais de cadastro
  const [nome, setNome] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  if (!isOpen) return null;

  const limparEErrar = (mensagem: string) => {
    setErro(mensagem);
    setCarregando(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        // Essencial: sem isso o navegador não guarda o cookie httpOnly que o backend manda de volta.
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok || dados?.success === false) {
        limparEErrar(dados?.message || 'Email ou senha inválidos.');
        return;
      }

      if (!dados?.user) {
        limparEErrar('Login realizado, mas o servidor não retornou os dados do usuário.');
        return;
      }

      setCarregando(false);
      onSuccess?.(dados.user);
      onClose();
    } catch {
      limparEErrar('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      // ATENÇÃO: ajuste o endpoint/campos abaixo conforme a rota real de cadastro do seu backend
      const resposta = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok || dados?.success === false) {
        limparEErrar(dados?.message || 'Não foi possível concluir o cadastro.');
        return;
      }

      if (dados?.user) {
        // Backend já loga automaticamente no cadastro (cookie já veio junto).
        setCarregando(false);
        onSuccess?.(dados.user);
        onClose();
      } else {
        // Caso contrário, leva o usuário para a aba de login para entrar com a conta criada.
        setCarregando(false);
        setTab('login');
        setSenha('');
        setConfirmarSenha('');
      }
    } catch {
      limparEErrar('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface text-text rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Abas */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErro(null);
            }}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              tab === 'login'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text opacity-60 hover:opacity-100'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('cadastro');
              setErro(null);
            }}
            className={`flex-1 py-4 text-center font-bold transition-colors ${
              tab === 'cadastro'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text opacity-60 hover:opacity-100'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="login-email" className="text-sm opacity-80">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="voce@email.com"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="login-senha" className="text-sm opacity-80">
                  Senha
                </label>
                <input
                  id="login-senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {erro && <p className="text-sm text-red-500">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors mt-2"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="cad-nome" className="text-sm opacity-80">
                  Nome
                </label>
                <input
                  id="cad-nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="cad-email" className="text-sm opacity-80">
                  Email
                </label>
                <input
                  id="cad-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="voce@email.com"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="cad-senha" className="text-sm opacity-80">
                  Senha
                </label>
                <input
                  id="cad-senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="cad-confirmar" className="text-sm opacity-80">
                  Confirmar senha
                </label>
                <input
                  id="cad-confirmar"
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {erro && <p className="text-sm text-red-500">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors mt-2"
              >
                {carregando ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}