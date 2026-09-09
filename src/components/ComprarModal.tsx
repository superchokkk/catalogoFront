import React, { useState, useEffect } from "react";
import type { Product } from "../models/Product";
import { theme } from "../theme"; 
import { useAuth } from "../context/AuthContext"; // Importe o seu contexto de autenticação

type ComprarModalProps = {
  produto: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ComprarModal({ produto, isOpen, onClose }: ComprarModalProps) {
  const [imagemAtiva, setImagemAtiva] = useState(0);
  
  // Pegue o usuário do seu contexto (ajuste 'user' e 'user.nome' conforme o seu AuthContext)
  const { user } = useAuth(); 

  // Defina o número do WhatsApp do dono do catálogo (Código do País + DDD + Número. Ex: 5511999999999)
  const NUMERO_ZAP = "5545999275216"; 

  useEffect(() => {
    if (isOpen) {
      setImagemAtiva(0);
    }
  }, [isOpen, produto]);

  if (!isOpen || !produto) return null;

  const precoAtual = Number(produto.preco);
  const precoAntigo = produto.promocao && produto.preco_antigo ? Number(produto.preco_antigo) : 0;
  const porcentagemDesconto =
    precoAntigo > precoAtual ? Math.round(((precoAntigo - precoAtual) / precoAntigo) * 100) : 0;

  const imagens = produto.produto_imagens || [];
  const imagemPrincipal = imagens[imagemAtiva]?.url_publica;

  // Função para abrir o WhatsApp com a mensagem dinâmica
  const handleWhatsAppClick = () => {
    const saudacao = user?.nome ? `Olá, me chamo ${user.nome}` : "Olá";
    const mensagem = `${saudacao}, gostaria de saber mais sobre ${produto.nome}.`;
    
    // encodeURIComponent garante que espaços e caracteres especiais funcionem na URL
    const url = `https://wa.me/${NUMERO_ZAP}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank'); // Abre em uma nova aba
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl p-6 max-w-lg w-full relative max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: theme.cores.terciaria }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:opacity-70 transition-opacity z-10 text-xl font-bold"
          style={{ color: theme.cores.secundaria }}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        {/* Visualização da Imagem Principal */}
        {imagemPrincipal && (
          <div className="mb-4 flex justify-center bg-black/20 rounded-xl p-2">
            <img
              src={imagemPrincipal}
              alt={produto.nome}
              className="h-64 w-auto rounded-lg object-contain"
            />
          </div>
        )}

        {/* Mini-Previews (Carrossel clicável) */}
        {imagens.length > 1 && (
          <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-thin">
            {imagens.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setImagemAtiva(index)}
                style={{
                  borderColor: imagemAtiva === index ? theme.cores.principal : "transparent"
                }}
                className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all duration-200 bg-black/20 ${
                  imagemAtiva === index
                    ? "opacity-100 scale-105" 
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url_publica}
                  alt={`${produto.nome} thumbnail ${index + 1}`}
                  className="h-16 w-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <h2 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.cores.secundaria }}
        >
          {produto.nome}
        </h2>
        
        <p 
          className="mb-6"
          style={{ color: theme.cores.secundaria, opacity: 0.85 }}
        >
          {produto.descricao}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span 
            className="text-3xl font-black"
            style={{ color: theme.cores.principal }}
          >
            R$ {precoAtual.toFixed(2)}
          </span>
          
          {produto.promocao && precoAntigo > precoAtual && (
            <span 
              className="line-through text-sm"
              style={{ color: theme.cores.secundaria, opacity: 0.6 }}
            >
              R$ {precoAntigo.toFixed(2)}
            </span>
          )}
          
          {porcentagemDesconto > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{porcentagemDesconto}%
            </span>
          )}
        </div>
        
        <button 
          onClick={handleWhatsAppClick}
          className="w-full hover:opacity-90 text-white font-bold py-3 rounded-xl transition-opacity mt-2 shadow-md flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: theme.cores.principal,
            paddingTop: "1em",
            paddingBottom: "1em"
          }}
        >
          {/* Ícone opcional do WhatsApp para dar mais clareza visual */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.031 0C5.405 0 0 5.405 0 12.031c0 2.126.551 4.182 1.597 6l-1.636 5.969 6.108-1.602C7.818 23.447 9.874 24 12 24c6.626 0 12-5.405 12-12.031S18.656 0 12.031 0zm0 22.012c-1.848 0-3.666-.496-5.263-1.444l-.377-.223-3.633.953.97-3.542-.245-.39c-1.04-1.657-1.59-3.585-1.59-5.586 0-5.523 4.492-10.015 10.015-10.015 5.522 0 10.015 4.493 10.015 10.015 0 5.523-4.493 10.015-10.015 10.015zm5.497-7.514c-.302-.15-1.782-.879-2.06-.979-.277-.1-.478-.15-.679.15-.201.302-.78 1-.955 1.202-.176.202-.352.227-.654.076-1.517-.756-2.585-1.564-3.574-3.23-.176-.301.077-.282.373-.872.1-.2.05-.376-.025-.526-.075-.15-.679-1.636-.93-2.242-.243-.59-.493-.51-.679-.519-.175-.008-.376-.01-.577-.01-.2 0-.527.076-.803.377-.277.302-1.054 1.031-1.054 2.513 0 1.482 1.08 2.914 1.231 3.115.151.201 2.124 3.243 5.143 4.544.718.309 1.28.494 1.716.633.722.23 1.378.197 1.897.12.58-.087 1.782-.728 2.033-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.202-.577-.353z"/>
          </svg>
          Contate-nos
        </button>
      </div>
    </div>
  );
}