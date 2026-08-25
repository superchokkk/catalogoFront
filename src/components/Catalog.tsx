import { useState, useEffect } from 'react';
import { AddProductModal } from './AddProductModal';

// Define a tipagem baseada no que sua API deve retornar
type Product = {
  id: string; // ou number, dependendo do banco de dados
  nome: string;
  descricao: string;
  preco: number;
};

export function Catalog() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Função que substitui o antigo consultarscript.js
  const carregarProdutos = async () => {
    try {
      // ATENÇÃO: Ajuste a URL abaixo para a rota exata do seu NestJS
      const resposta = await fetch('http://localhost:3000/api/products'); 
      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar produtos da API:", erro);
    } finally {
      setCarregando(false);
    }
  };

  // Executa automaticamente quando o componente é montado na tela
  useEffect(() => {
    carregarProdutos();
  }, []);
  
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-hover"
        >
          + Adicionar Produto
        </button>
      </div>

      {carregando ? (
        <p className="text-center text-text opacity-80">Carregando catálogo...</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.length === 0 ? (
            <p className="text-text opacity-80 col-span-full">Nenhum produto cadastrado no momento.</p>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id} className="bg-surface p-4 rounded-lg shadow border border-gray-200">
                <div className="w-full h-48 bg-gray-300 rounded-md mb-4 flex items-center justify-center text-gray-500">Imagem</div>
                <h3 className="font-bold text-lg mb-1">{produto.nome}</h3>
                <p className="text-sm opacity-80 mb-2 truncate">{produto.descricao}</p>
                <p className="text-primary font-bold">R$ {Number(produto.preco).toFixed(2)}</p>
              </div>
            ))
          )}
        </section>
      )}

      {/* Passamos o carregarProdutos para que o modal atualize a lista ao salvar */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={carregarProdutos}
      />
    </div>
  );
}