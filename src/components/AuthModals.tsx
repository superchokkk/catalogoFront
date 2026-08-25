import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase'; // Importando o cliente configurado

type AuthModalsProps = {
  activeModal: 'login' | 'register' | 'recover' | null;
  setActiveModal: (modal: 'login' | 'register' | 'recover' | null) => void;
};

export function AuthModals({ activeModal, setActiveModal }: AuthModalsProps) {
  const [recoverStep, setRecoverStep] = useState<'email' | 'code'>('email');
  
  // Estados dos inputs
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  if (!activeModal) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Autenticação direta com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });
      
      if (error) {
        alert("E-mail ou senha inválidos.");
        console.error("Erro do Supabase:", error.message);
      } else {
        alert("Login efetuado!");
        // O Supabase já salvou o token de sessão de forma segura.
        setActiveModal(null); 
      }
    } catch (error) {
      console.error("Erro inesperado no login", error);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Registro direto com o Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            nome: nome, // Salva o nome extra nos metadados do usuário
          }
        }
      });
      
      if (error) {
        alert("Falha ao registrar usuário.");
        console.error("Erro do Supabase:", error.message);
      } else {
        alert("Cadastro efetuado! Agora faça o login.");
        setActiveModal('login');
      }
    } catch (error) {
      console.error("Erro inesperado no cadastro", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-lg w-96 p-6">
        
        {activeModal === 'login' && (
          <>
            <h2 className="text-xl font-bold mb-4 text-text">Login</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-text opacity-90">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-400 bg-background px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text opacity-90">Senha</label>
                <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-400 bg-background px-3 py-2 outline-none" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-sm text-text opacity-80">
                  Não tem conta? <button type="button" onClick={() => setActiveModal('register')} className="text-primary hover:underline">Cadastre-se</button>
                </p>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Entrar</button>
                </div>
              </div>
            </form>
          </>
        )}

        {activeModal === 'register' && (
          <>
            <h2 className="text-xl font-bold mb-4 text-text">Criar Conta</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-text opacity-90">Nome</label>
                <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className="mt-1 block w-full rounded-md border-gray-400 border bg-background px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text opacity-90">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-400 border bg-background px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text opacity-90">Senha</label>
                <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} className="mt-1 block w-full rounded-md border-gray-400 border bg-background px-3 py-2 outline-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Cadastrar</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}