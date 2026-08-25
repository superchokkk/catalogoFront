import { useState, FormEvent } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Gatilho para recarregar o catálogo
};

export function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
  // Estados para capturar o que o usuário digita
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  if (!isOpen) return null;

  // Função disparada ao clicar em "Adicionar"
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // ATENÇÃO: Ajuste a URL abaixo para a rota exata do seu NestJS
      const resposta = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco.replace(',', '.')),
          quantidade: parseInt(quantidade)
        })
      });

      if (resposta.ok) {
        // Limpa o formulário
        setNome(''); setDescricao(''); setPreco(''); setQuantidade('');
        onSuccess(); // Atualiza a lista lá no componente Catalog
        onClose();   // Fecha o modal
      } else {
        alert("Erro ao adicionar produto na API.");
      }
    } catch (erro) {
      console.error("Falha de rede:", erro);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4 text-text">Adicionar Produto</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text opacity-90">Nome</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-400 bg-background text-text px-3 py-2 outline-none" placeholder="Nome do produto" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text opacity-90">Descrição</label>
            <input type="text" required value={descricao} onChange={(e) => setDescricao(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-400 bg-background text-text px-3 py-2 outline-none" placeholder="Descrição" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text opacity-90">Preço</label>
            <input type="text" required value={preco} onChange={(e) => setPreco(e.target.value)} inputMode="decimal" className="mt-1 block w-full rounded-md border border-gray-400 bg-background text-text px-3 py-2 outline-none" placeholder="199.90" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text opacity-90">Quantidade</label>
            <input type="number" required value={quantidade} onChange={(e) => setQuantidade(e.target.value)} step="1" min="0" className="mt-1 block w-full rounded-md border border-gray-400 bg-background text-text px-3 py-2 outline-none" placeholder="Qtd" />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
}