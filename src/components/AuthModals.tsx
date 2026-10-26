import { useState, type FormEvent } from 'react';
import type { User } from '../context/AuthContext';
import { apiFetch, jsonBody, mensagemDeErro } from '../lib/api';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
};

// Adicionamos os estados das novas telas do fluxo de senha
type Tab = 'login' | 'esqueci-email' | 'esqueci-codigo';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Campos de login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Campos específicos para recuperação de senha
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [codigoToken, setCodigoToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

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
      // 401 aqui significa credenciais erradas, então não tentamos refresh.
      const resposta = await apiFetch('/auth/login', jsonBody({ email, senha }), true);

      if (!resposta.ok) {
        limparEErrar(await mensagemDeErro(resposta, 'Email ou senha inválidos.'));
        return;
      }

      const dados = await resposta.json().catch(() => null);

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

  const handleEnviarEmailRecuperacao = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!emailRecuperacao) {
      setErro('Informe seu e-mail.');
      return;
    }

    setCarregando(true);
    try {
      // A resposta é sempre genérica (não revela se o e-mail existe).
      const resposta = await apiFetch('/auth/esqueci-senha', jsonBody({ email: emailRecuperacao }), true);
      if (!resposta.ok) {
        limparEErrar(await mensagemDeErro(resposta, 'Não foi possível enviar o código.'));
        return;
      }
      setCarregando(false);
      setTab('esqueci-codigo');
    } catch {
      limparEErrar('Não foi possível conectar ao servidor. Tente novamente.');
    }
  };

  const handleEnviarCodigoENovaSenha = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!codigoToken || !novaSenha) {
      setErro('Preencha o código e a nova senha.');
      return;
    }
    if (novaSenha.length < 8 || novaSenha.length > 72) {
      setErro('A nova senha deve ter entre 8 e 72 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await apiFetch(
        '/auth/redefinir-senha',
        jsonBody({ email: emailRecuperacao, token: codigoToken.trim(), novaSenha }),
        true,
      );
      if (!resposta.ok) {
        limparEErrar(await mensagemDeErro(resposta, 'Código inválido ou expirado.'));
        return;
      }
    } catch {
      limparEErrar('Não foi possível conectar ao servidor. Tente novamente.');
      return;
    }

    setCarregando(false);
    setSucessoMsg('Senha redefinida com sucesso! Faça login com a nova senha.');
    setTimeout(() => {
      setSucessoMsg(null);
      setTab('login');
      setEmail(emailRecuperacao);
      setSenha('');
      setCodigoToken('');
      setNovaSenha('');
    }, 2000);
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
        {/* Aba de login */}
        {tab === 'login' && (
          <div className="flex border-b border-white/10">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErro(null);
              }}
              className={`flex-1 py-4 text-center font-bold transition-colors ${tab === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text opacity-60 hover:opacity-100'
                }`}
            >
              Entrar
            </button>
          </div>
        )}

        {/* Título dinâmico para as telas de recuperação de senha */}
        {tab === 'esqueci-email' && (
          <div className="p-6 pb-0 text-left">
            <h2 className="text-xl font-bold">Recuperar Senha</h2>
            <p className="text-sm opacity-70 mt-1">Digite seu e-mail para receber o código.</p>
          </div>
        )}

        {tab === 'esqueci-codigo' && (
          <div className="p-6 pb-0 text-left">
            <h2 className="text-xl font-bold">Inserir Código</h2>
            <p className="text-sm opacity-70 mt-1">Enviamos um código para {emailRecuperacao}.</p>
          </div>
        )}

        <div className="p-6">
          {tab === 'login' && (
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

              <button
                type="button"
                onClick={() => {
                  setTab('esqueci-email');
                  setErro(null);
                  setEmailRecuperacao(email);
                }}
                className="w-full bg-transparent text-primary hover:underline font-medium py-1 rounded-full transition-colors"
              >
                Esqueci minha senha
              </button>
            </form>
          )}

          {/* Etapa 1 do Esqueci Senha: colocar o email */}
          {tab === 'esqueci-email' && (
            <form onSubmit={handleEnviarEmailRecuperacao} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="rec-email" className="text-sm opacity-80">
                  Seu e-mail cadastrado
                </label>
                <input
                  id="rec-email"
                  type="email"
                  required
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="voce@email.com"
                />
              </div>

              {erro && <p className="text-sm text-red-500">{erro}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors mt-2"
              >
                Enviar código
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErro(null);
                }}
                className="w-full bg-transparent text-primary hover:underline font-medium py-1 rounded-full text-sm"
              >
                Voltar para o login
              </button>
            </form>
          )}

          {/* Etapa 2 do Esqueci Senha: Inserir Código e Nova Senha */}
          {tab === 'esqueci-codigo' && (
            <form onSubmit={handleEnviarCodigoENovaSenha} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="rec-codigo" className="text-sm opacity-80">
                  Código de Verificação
                </label>
                <input
                  id="rec-codigo"
                  type="text"
                  required
                  value={codigoToken}
                  onChange={(e) => setCodigoToken(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  inputMode="numeric"
                  pattern="[0-9]{6,10}"
                  title="Código de 6 a 10 dígitos"
                  placeholder="Ex: 123456"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="rec-nova-senha" className="text-sm opacity-80">
                  Nova Senha
                </label>
                <input
                  id="rec-nova-senha"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-text outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {erro && <p className="text-sm text-red-500">{erro}</p>}
              {sucessoMsg && <p className="text-sm text-green-400">{sucessoMsg}</p>}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors mt-2"
              >
                Redefinir Senha
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('esqueci-email');
                  setErro(null);
                }}
                className="w-full bg-transparent text-primary hover:underline font-medium py-1 rounded-full text-sm"
              >
                Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}