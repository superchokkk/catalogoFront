import { useState, useEffect } from 'react';
import { AddProductModal, DellProductModal, EditProductModal } from './AdminProductModal';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../models/Product';
import { ComprarModal } from './ComprarModal';
import { theme } from '../theme';

export function Catalog() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDellModalOpen, setIsDellModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isComprarModalOpen, setIsComprarModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 6;

  const { isAdmin: admin } = useAuth();

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/listagem`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos(Array.isArray(dados) ? dados : dados.produtos ?? []);
      }
    } catch (erro) {
      console.error("Erro ao buscar produtos da API:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const deletarProduto = async (idProduto: string) => {
    try {
      const resposta = await fetch(`local/api/produtos/${idProduto}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (resposta.ok) {
        alert("Produto excluído!");
        return true;
      }
    } catch (erro) {
      console.error("Erro", erro);
      return false;
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleComprar = (produto: Product) => {
    setProdutoSelecionado(produto);
    setIsComprarModalOpen(true);
  };

  const indexUltimoProduto = paginaAtual * ITENS_POR_PAGINA;
  const indexPrimeiroProduto = indexUltimoProduto - ITENS_POR_PAGINA;
  const produtosAtuais = produtos.slice(indexPrimeiroProduto, indexUltimoProduto);
  const totalPaginas = Math.ceil(produtos.length / ITENS_POR_PAGINA);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        {admin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-white rounded-md shadow hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.cores.principal }}
          >
            + Adicionar Produto
          </button>
        )}
      </div>

      {carregando ? (
        <p className="text-center text-text opacity-80">Carregando catálogo...</p>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.length === 0 ? (
              <p className="text-text opacity-80 col-span-full text-center py-10">
                Nenhum produto cadastrado no momento.
              </p>
            ) : (
              produtosAtuais.map((produto) => {
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
                    className="relative bg-surface p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col w-full max-w-sm h-full min-h-[480px] cursor-pointer hover:shadow-xl transition-shadow group text-left mx-auto"
                    role="button"
                    tabIndex={0}
                  >
                    {/* Botões de Ação com Cores Inline do theme.ts */}
                    {admin && (
                      <div className="absolute top-3 right-3 flex gap-2 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProdutoSelecionado(produto);
                            setIsEditModalOpen(true);
                          }}
                          className="font-bold text-sm px-3 py-1.5 rounded-lg shadow transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: theme.cores.amarelo, // Amarelo
                            color: '#000000', // Texto preto
                            border: `1px solid ${theme.cores.amarelo}`
                          }}
                        >
                          Editar
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProdutoSelecionado(produto);
                            setIsDellModalOpen(true);
                          }}
                          className="font-bold text-sm px-3 py-1.5 rounded-lg shadow transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: theme.cores.vermelho, // Vermelho
                            color: '#FFFFFF', // Texto branco
                            border: `1px solid ${theme.cores.vermelho}`
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}

                    <div className="w-full h-[35vh] max-h-72 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 mb-4 flex-shrink-0 relative">
                      <img
                        className="w-full h-full object-cover object-center rounded-2xl"
                        src={produto.produto_imagens?.[0]?.url_publica || '/placeholder-image.png'}
                        alt={produto.nome}
                      />
                    </div>

                    <div className="flex flex-col flex-1 text-left">
                      <h3 className="font-extrabold text-2xl text-white text-left">
                        {produto.nome}
                      </h3>
                      <p className="text-base text-white opacity-70 mt-2 line-clamp-3 text-left">
                        {produto.descricao}
                      </p>
                    </div>

                    <div className="flex flex-col mt-auto pt-4">
                      <div className="flex justify-between items-end mb-4 min-h-[48px] text-left">
                        <span
                          className="text-2xl font-black text-left"
                          style={{ color: theme.cores.principal }}
                        >
                          R$ {precoAtual.toFixed(2)}
                        </span>

                        {produto.promocao && precoAntigo > precoAtual && (
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                            <span
                              className="text-white text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: theme.cores.vermelho }}
                            >
                              -{porcentagemDesconto}%
                            </span>
                            <span className="text-sm md:text-base font-semibold text-gray-400 line-through">
                              R$ {precoAntigo.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        className="w-full hover:opacity-90 text-white text-center font-bold py-5 text-xl rounded-full transition-opacity cursor-pointer shadow-md"
                        style={{ backgroundColor: theme.cores.principal }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComprar(produto);
                        }}
                      >
                        Comprar
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual((prev) => prev - 1)}
                className="px-5 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Anterior
              </button>

              <span className="text-white font-semibold">
                Página {paginaAtual} de {totalPaginas}
              </span>

              <button
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual((prev) => prev + 1)}
                className="px-5 py-2 text-white font-bold rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme.cores.principal }}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        produto={produtoSelecionado}
        onSuccess={() => {
          carregarProdutos();
          setPaginaAtual(1);
        }}
      />
      <DellProductModal
        isOpen={isDellModalOpen}
        onClose={() => setIsDellModalOpen(false)}
        produto={produtoSelecionado}
        onSuccess={async() => {
          if (produtoSelecionado) {
            const sucesso = await deletarProduto(produtoSelecionado.id);
            if (sucesso) {
              setIsDellModalOpen(false);
              carregarProdutos();
              setPaginaAtual(1);
            }
          }
          carregarProdutos();
          setPaginaAtual(1);
        }}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        produto={produtoSelecionado}
        onSuccess={() => {
          carregarProdutos();
          setPaginaAtual(1);
        }}
      />
      <ComprarModal
        produto={produtoSelecionado}
        isOpen={isComprarModalOpen}
        onClose={() => setIsComprarModalOpen(false)}
      />
    </div>
  );
}