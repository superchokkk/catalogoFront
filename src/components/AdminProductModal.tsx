import React, { useState, useEffect } from 'react';
import { theme } from '../theme'; 
import type { Product, Image } from '../models/Product';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  produto: Product | null;
};

export function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [imagens, setImagens] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagens(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', parseFloat(preco.replace(',', '.')).toString());
    formData.append('quantidade', parseInt(quantidade, 10).toString());

    imagens.forEach((file) => {
      formData.append('imagens', file);
    });

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/criar`, {
        method: 'POST',
        // O navegador enviará o cookie HttpOnly automaticamente
        credentials: 'include', 
        body: formData,
      });

      if (resposta.ok) {
        setNome('');
        setDescricao('');
        setPreco('');
        setQuantidade('');
        setImagens([]);
        onSuccess();
        onClose();
      } else {
        const erroMsg = await resposta.text();
        alert(`Erro ao adicionar produto: ${erroMsg}`);
      }
    } catch (erro) {
      console.error("Falha de rede:", erro);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="rounded-lg shadow-2xl w-96 p-6"
        style={{ backgroundColor: theme.cores.terciaria }}
      >
        <h2 
          className="text-xl font-bold mb-4" 
          style={{ color: theme.cores.secundaria }}
        >
          Adicionar Produto
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Nome</label>
            <input 
              type="text" 
              required 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
              style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              placeholder="Nome do produto" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Descrição</label>
            <input 
              type="text" 
              required 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
              style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              placeholder="Descrição" 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Preço</label>
              <input 
                type="text" 
                required 
                value={preco} 
                onChange={(e) => setPreco(e.target.value)} 
                inputMode="decimal" 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
                placeholder="199.90" 
              />
            </div>
            
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Quantidade</label>
              <input 
                type="number" 
                required 
                value={quantidade} 
                onChange={(e) => setQuantidade(e.target.value)} 
                step="1" 
                min="0" 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
                placeholder="Qtd" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Imagens (Até 10)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileChange} 
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold cursor-pointer"
              style={{ color: theme.cores.secundaria }}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'transparent', border: `1px solid ${theme.cores.secundaria}`, color: theme.cores.secundaria }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: theme.cores.principal, color: '#fff' }}
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DellProductModal({ isOpen, onClose, onSuccess }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity">
      <div 
        className="rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative"
        style={{ backgroundColor: theme.cores.terciaria }}
      >
        {/* Ícone de Alerta (Opcional, dá um visual legal para avisos) */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg 
            className="h-10 w-10 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: theme.cores.vermelho }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 
          className="text-2xl font-extrabold mb-2"
          style={{ color: theme.cores.secundaria }}
        >
          Excluir Produto
        </h2>
        
        <p 
          className="mb-8 text-sm"
          style={{ color: theme.cores.secundaria, opacity: 0.85 }}
        >
          Tem certeza que deseja excluir este produto? <br />
          <span className="font-bold">Esta ação não pode ser desfeita.</span>
        </p>

        <div className="flex justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold transition-opacity hover:opacity-80 w-1/2"
            style={{ 
              backgroundColor: 'transparent', 
              border: `2px solid ${theme.cores.secundaria}`, 
              color: theme.cores.secundaria 
            }}
          >
            Cancelar
          </button>
          
          <button 
            onClick={onSuccess}
            className="px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-md w-1/2"
            style={{ 
              backgroundColor: theme.cores.vermelho, 
              color: '#FFFFFF' 
            }}
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditProductModal({ isOpen, onClose, onSuccess, produto }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [precoAntigo, setPrecoAntigo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [status, setStatus] = useState(true);
  const [promocao, setPromocao] = useState(false);
  
  // Imagens
  const [imagensAtuais, setImagensAtuais] = useState<Image[]>([]);
  const [novasImagens, setNovasImagens] = useState<File[]>([]);

  // Carrega os dados do produto sempre que o modal abre
  useEffect(() => {
    if (isOpen && produto) {
      setNome(produto.nome);
      setDescricao(produto.descricao);
      setPreco(produto.preco.toString());
      setPrecoAntigo(produto.preco_antigo ? produto.preco_antigo.toString() : '');
      setQuantidade(produto.quantidade.toString());
      setStatus(produto.status);
      setPromocao(produto.promocao);
      setImagensAtuais(produto.produto_imagens || []);
      setNovasImagens([]);
    }
  }, [isOpen, produto]);

  if (!isOpen || !produto) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNovasImagens((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removerImagemAtual = (idParaRemover: string) => {
    setImagensAtuais((prev) => prev.filter((img) => img.id !== idParaRemover));
  };

  const removerNovaImagem = (indexParaRemover: number) => {
    setNovasImagens((prev) => prev.filter((_, index) => index !== indexParaRemover));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', parseFloat(preco.replace(',', '.')).toString());
    formData.append('quantidade', parseInt(quantidade, 10).toString());
    formData.append('status', status.toString());
    formData.append('promocao', promocao.toString());
    
    if (precoAntigo) {
      formData.append('preco_antigo', parseFloat(precoAntigo.replace(',', '.')).toString());
    }

    // O backend espera as imagens que DEVEM SER MANTIDAS em formato JSON
    formData.append('imagensExistentes', JSON.stringify(imagensAtuais));

    // Anexa as novas imagens selecionadas
    novasImagens.forEach((file) => {
      formData.append('imagens', file);
    });

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/${produto.id}`, {
        method: 'PUT',
        credentials: 'include', // Envia o Cookie HttpOnly automaticamente
        body: formData,
      });

      if (resposta.ok) {
        onSuccess();
        onClose();
      } else {
        const erroMsg = await resposta.text();
        alert(`Erro ao atualizar produto: ${erroMsg}`);
      }
    } catch (erro) {
      console.error("Falha de rede:", erro);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{ backgroundColor: theme.cores.terciaria }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.cores.amarelo }}>
            Editar Produto
          </h2>
          <button onClick={onClose} style={{ color: theme.cores.secundaria }} className="text-2xl font-bold hover:opacity-70">
            ✕
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nome e Descrição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Nome</label>
              <input 
                type="text" required value={nome} onChange={(e) => setNome(e.target.value)} 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Descrição</label>
              <input 
                type="text" required value={descricao} onChange={(e) => setDescricao(e.target.value)} 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              />
            </div>
          </div>
          
          {/* Preços e Quantidade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Preço (Atual)</label>
              <input 
                type="text" required value={preco} onChange={(e) => setPreco(e.target.value)} inputMode="decimal" 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Preço Antigo</label>
              <input 
                type="text" value={precoAntigo} onChange={(e) => setPrecoAntigo(e.target.value)} inputMode="decimal" 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.cores.secundaria }}>Quantidade</label>
              <input 
                type="number" required value={quantidade} onChange={(e) => setQuantidade(e.target.value)} min="0" 
                className="block w-full rounded-md border px-3 py-2 outline-none focus:ring-1 bg-black/20"
                style={{ color: theme.cores.secundaria, borderColor: theme.cores.secundaria }}
              />
            </div>
          </div>

          {/* Toggles (Status e Promoção) */}
          <div className="flex gap-6 py-2 border-y border-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} 
                className="w-5 h-5 accent-blue-600 rounded"
              />
              <span style={{ color: theme.cores.secundaria }}>Produto Ativo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" checked={promocao} onChange={(e) => setPromocao(e.target.checked)} 
                className="w-5 h-5 accent-red-600 rounded"
              />
              <span style={{ color: theme.cores.secundaria }}>Em Promoção</span>
            </label>
          </div>

          {/* Gerenciamento de Imagens */}
          <div>
            <label className="block text-sm font-bold mb-2 mt-2" style={{ color: theme.cores.secundaria }}>
              Imagens Atuais (Clique no ✕ para remover)
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagensAtuais.length === 0 && <span className="text-sm opacity-50" style={{ color: theme.cores.secundaria }}>Nenhuma imagem mantida.</span>}
              {imagensAtuais.map((img) => (
                <div key={img.id} className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-500">
                  <img src={img.url_publica} alt="Atual" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removerImagemAtual(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md"
                  >✕</button>
                </div>
              ))}
            </div>

            <label className="block text-sm font-bold mb-2 mt-4" style={{ color: theme.cores.secundaria }}>
              Adicionar Novas Imagens
            </label>
            <input 
              type="file" multiple accept="image/*" onChange={handleFileChange} 
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold cursor-pointer mb-2"
              style={{ color: theme.cores.secundaria }}
            />
            {/* Lista das novas imagens selecionadas prontas para envio */}
            {novasImagens.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {novasImagens.map((file, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-900/40 border border-blue-500/50 rounded-full text-xs flex items-center gap-2" style={{ color: theme.cores.secundaria }}>
                    {file.name}
                    <button type="button" onClick={() => removerNovaImagem(index)} className="text-red-400 font-bold hover:text-red-300">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-6">
            <button 
              type="button" onClick={onClose} 
              className="px-6 py-2.5 rounded-md transition-opacity hover:opacity-80 font-bold"
              style={{ backgroundColor: 'transparent', border: `2px solid ${theme.cores.secundaria}`, color: theme.cores.secundaria }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 rounded-md font-extrabold transition-opacity hover:opacity-90 shadow-lg"
              style={{ backgroundColor: theme.cores.vermelho, color: '#000000' }}
            >
              Salvar Alterações
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}