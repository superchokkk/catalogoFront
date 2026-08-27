import { useState, useEffect } from 'react';
import { AddProductModal } from './AddProductModal';
import { useAuth } from '../context/AuthContext';

type Image = {
  id: string;
  url_path: string;
  url_publica: string;
};
type Product = {
  id: string;
  nome: string;
  preco: number;
  preco_antigo: number | null;
  quantidade: number;
  status: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  descricao: string;
  promocao: boolean;
  produto_imagens: Image[];
};

export function Catalog() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Vem do AuthContext: atualiza sozinho quando o usuário loga/desloga, sem reload.
  const { isAdmin: admin } = useAuth();

  // Função que substitui o antigo consultarscript.js
  const carregarProdutos = async () => {
    try {
      // ATENÇÃO: Ajuste a URL abaixo para a rota exata do seu NestJS
      const resposta = await fetch('http://localhost:3000/api/produtos/listagem');
      if (resposta.ok) {
        const dados = await resposta.json();
        // Aceita tanto { produtos: [...] } quanto um array puro de produtos
        setProdutos(Array.isArray(dados) ? dados : dados.produtos ?? []);
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
        {admin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-hover"
          >
            + Adicionar Produto
          </button>
        )}
      </div>

      {carregando ? (
        <p className="text-center text-text opacity-80">Carregando catálogo...</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.length === 0 ? (
            <p className="text-text opacity-80 col-span-full">Nenhum produto cadastrado no momento.</p>
          ) : (
            produtos.map((produto) => {
              const precoAtual = Number(produto.preco);

              let precoAntigo = 0;
              let porcentagemDesconto = 0;

              if (produto.promocao && produto.preco_antigo) {
                precoAntigo = Number(produto.preco_antigo);
                if (precoAntigo > precoAtual) {
                  porcentagemDesconto = Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100);
                }
              }

              return (
                <div
                  key={produto.id}
                  onClick={() => console.log(`Produto clicado: ${produto.nome}`)}
                  className="relative bg-surface p-6 rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col w-full max-w-sm h-full min-h-[480px] cursor-pointer hover:shadow-xl transition-shadow group text-left"
                  role="button"
                  tabIndex={0}
                >
                  {/* Botões de Editar/Excluir — visíveis somente para admin (nivel 0 ou 1) */}
                  {admin && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique "vaze" para o card de baixo
                          console.log('Editar produto', produto.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-colors"
                        title="Editar Produto"
                      >
                        Editar
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Impede que o clique "vaze" para o card de baixo
                          console.log('Excluir produto', produto.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-colors"
                        title="Excluir Produto"
                      >
                        Excluir
                      </button>
                    </div>
                  )}

                  {/* 1. Imagem do Produto */}
                  <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 mb-4 flex-shrink-0">
                    <img
                      className="max-h-full max-w-full object-contain rounded-2xl"
                      src={produto.produto_imagens?.[0]?.url_publica || '/placeholder-image.png'}
                      alt={produto.nome}
                    />
                  </div>

                  {/* 2. Nome e descrição — alinhados à esquerda */}
                  <div className="flex flex-col flex-1 text-left">
                    <h3 className="font-extrabold text-2xl text-white text-left">
                      {produto.nome}
                    </h3>
                    <p className="text-base text-white opacity-70 mt-2 line-clamp-3 text-left">
                      {produto.descricao}
                    </p>
                  </div>

                  {/* 3. Preço + botão — fixos na base do card via mt-auto */}
                  <div className="flex flex-col mt-auto pt-4">

                    <div className="flex justify-between items-end mb-4 min-h-[48px] text-left">

                      <span className="text-2xl font-black text-primary text-left">
                        R$ {precoAtual.toFixed(2)}
                      </span>

                      {produto.promocao && precoAntigo > precoAtual && (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            -{porcentagemDesconto}%
                          </span>
                          <span className="text-sm md:text-base font-semibold text-red-600 line-through">
                            R$ {precoAntigo.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 4. Botão de Ação Inferior — sempre colado na base */}
                    <div className="w-full bg-primary group-hover:bg-opacity-90 text-white text-center font-bold py-5 text-xl rounded-full transition-all">
                      Comprar
                    </div>
                  </div>
                </div>
              );
            })
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