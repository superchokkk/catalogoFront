# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

Execute a partir do diretório `frontend/` (é a raiz do projeto; não há package.json na raiz acima).

- `npm run dev` — servidor de desenvolvimento do Vite
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — `oxlint` (configuração em `.oxlintrc.json`)
- `npm run preview` — serve o `dist/` gerado
- `npm run build:css` — build avulso do Tailwind CLI para `public/css/style.css` (desnecessário no dia a dia; o Tailwind roda via PostCSS/`@tailwindcss/postcss` dentro do Vite)

Não há test runner configurado.

## Arquitetura

SPA em React 19 + Vite + TypeScript + Tailwind v4: um catálogo de produtos (textos de interface e identificadores em português; a marca é "DG Concept", ver `src/theme.ts`).

**O backend é uma API REST separada (NestJS), não o Supabase.** Apesar do README e de `src/lib/supabase.ts`, nenhum componente importa o cliente Supabase; todos os dados e a autenticação passam por `fetch` para `${import.meta.env.VITE_API_URL}/api/...`:
- A autenticação usa um cookie httpOnly, então toda chamada relacionada a auth precisa de `credentials: 'include'`. O `AuthContext` restaura a sessão ao carregar via `GET /api/auth/me` e faz logout via `POST /api/auth/logout`. O usuário tem o formato `{ id, nome, email, nivel }`; `isAdmin` é `nivel === 0 || nivel === 1`.
- Produtos: `GET /api/produtos/listagem` (ver `Catalog.tsx`); o tipo `Product` em `src/models/Product.ts` espelha a resposta da API, incluindo `produto_imagens`.
- Variáveis de ambiente ficam no `.env`: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

**Estrutura:** `App.tsx` envolve tudo em `AuthProvider` + `BrowserRouter` com duas rotas: `/` (Header + Catalog + AuthModal) e `/update-password`. `Catalog.tsx` controla o estado dos produtos, a paginação no cliente (`ITENS_POR_PAGINA`) e a abertura dos modais de admin (`AdminProductModal.tsx`: adicionar/editar/excluir) e de compra (`ComprarModal.tsx`); os controles de admin dependem de `useAuth().isAdmin`.

**Estilização:** Tailwind v4 com tokens de tema em variáveis CSS (`--color-primary`, `--color-background`, `--color-surface`, `--btn-*`, etc.) definidos em `src/styles/input.css` e mapeados para nomes de utilitários em `tailwind.config.js` (`bg-background`, `text-text`, `bg-primary`, ...). O `main.tsx` também importa `index.css` e os CSS antigos `assets/css/style.css` e `assets/mycss/mystyle.css`.

**`src/legacy/`** guarda a versão anterior do app em HTML/JS puro (`interface.html`, `js/*.js`, `css/`). Serve de referência para portar comportamento para o React e não faz parte do build.

## Contrato da API

O contrato vive em `docs/openapi.json` (prevalece em caso de divergência) e `docs/API-FRONT.md`. Pontos que afetam o código:

- Todas as chamadas passam por `apiFetch` (`src/lib/api.ts`): envia cookies, em 401 chama `POST /auth/refresh` e repete a requisição uma vez; `mensagemDeErro` extrai `message` (string ou array). Não defina `Content-Type` ao enviar `FormData`.
- `GET /auth/me` devolve o objeto do usuário direto (sem `success`/`user`); `GET /produtos/listagem` devolve `{ produtos, podeAtualizarUI }`.
- Criar/editar produto é `multipart/form-data` e o backend rejeita campos desconhecidos (400): só `nome`, `descricao`, `preco`, `preco_antigo`, `promocao`, `imagensExistentes` (JSON com as `url_publica` a manter) e `imagens`. Não existem `quantidade` nem `status`.
- Cadastro (`POST /usuarios/criar`, aba "Cadastrar" em `AuthModals.tsx`) não faz login: o front chama `/auth/login` em seguida. O usuário nasce com nível padrão (não admin).
- Redefinição de senha: código OTP via `/auth/redefinir-senha`; por link, `/update-password` só chama `/auth/set-session` (a API não tem endpoint para definir a nova senha após isso).
