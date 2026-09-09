export type Image = {
  id: string;
  url_path: string;
  url_publica: string;
};

export type Product = {
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