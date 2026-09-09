# Catalogo Front

Uma aplicação web frontend moderna para um catálogo de produtos. Este projeto foi construído utilizando React, Vite, TypeScript, Tailwind CSS e integra-se com o Supabase para serviços de backend, como autenticação de usuários.

## 🚀 Tecnologias Utilizadas

* **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend/BaaS:** [Supabase](https://supabase.com/) (Autenticação e Banco de Dados)
* **Linting:** Oxlint

## 📁 Estrutura do Projeto

O código principal da aplicação está localizado no diretório `src`:

* **`src/components/`**: Componentes de interface (UI) reutilizáveis, incluindo o catálogo principal (`Catalog`), cabeçalho (`Header`) e vários modais interativos (`AdminProductModal`, `AuthModals`, `ComprarModal`).
* **`src/context/`**: Provedores de Contexto do React (Context API), como `AuthContext.tsx` para gerenciar o estado de autenticação do usuário em toda a aplicação.
* **`src/lib/`**: Integrações e configurações de bibliotecas de terceiros (contém a configuração do cliente Supabase em `supabase.ts`).
* **`src/models/`**: Interfaces TypeScript e modelos de dados (ex: `Product.ts`).
* **`src/styles/` & `src/assets/`**: Folhas de estilo globais, arquivos de entrada do Tailwind e arquivos estáticos (como imagens e ícones).
* **`src/legacy/`**: Contém arquivos HTML, JS e CSS legados de versões anteriores ou integrações externas.

## ⚙️ Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 16 ou superior recomendada)
* Um gerenciador de pacotes (npm, yarn ou pnpm)

## 🛠️ Instalação e Configuração

1. **Navegue até o diretório do projeto:**
   ```bash
   cd catalogoFront
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto para adicionar suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_projeto_supabase
   VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação normalmente estará disponível no endereço `http://localhost:5173`.

## 📦 Scripts Disponíveis

* `npm run dev`: Inicia o servidor de desenvolvimento do Vite.
* `npm run build`: Compila o código TypeScript e constrói a aplicação otimizada para produção.
* `npm run preview`: Inicia um servidor web local para visualizar a versão de produção gerada no build.