# API do Catálogo — guia para o front-end

Contrato formal (rotas, DTOs, respostas, erros): **`openapi.json`** (nesta pasta). Este guia cobre só o que o OpenAPI não deixa óbvio. Em caso de divergência, vale o `openapi.json`.

- Base URL: `<host do back>/api` (dev: `http://localhost:3000/api`)
- Swagger interativo (só em dev): `<host>/docs` — JSON em `<host>/docs-json`
- Para gerar tipos: `npx openapi-typescript docs/openapi.json -o src/api-types.ts`

## 1. Autenticação (cookies, não Bearer)

- `POST /auth/login` grava dois cookies httpOnly: `access_token` (~1 h) e `refresh_token` (30 dias, só enviado a `/api/auth/refresh`). **O front não lê nem guarda token.**
- **Toda requisição** ao back deve enviar cookies: `fetch(..., { credentials: 'include' })` ou axios `withCredentials: true`.
- O front deve rodar em origem autorizada pelo back (`FRONTEND_URL` / `CORS_ORIGINS`). Requisições que alteram dados (não-GET) de outra origem recebem **403**.
- Cookies são `sameSite: none` (+ `secure` em produção): em produção é obrigatório HTTPS.
- Não use header `Authorization`.

### Renovação de sessão
Ao receber **401** numa rota autenticada: chame `POST /auth/refresh` (sem corpo) e repita a requisição original **uma vez**. Se o refresh também retornar 401, a sessão acabou: mande o usuário para o login.

### Saber quem está logado
`GET /auth/me` devolve o objeto do usuário direto (sem `success`/`message`), incluindo `nivel` e `nome`. Use ao carregar o app.

### Recuperação de senha
1. `POST /auth/esqueci-senha` `{email}` — resposta sempre genérica (não revela se o e-mail existe).
2. Usuário recebe e-mail com código (OTP) ou link:
   - **Código:** `POST /auth/redefinir-senha` `{email, token (6–10 dígitos), novaSenha (8–72)}`.
   - **Link:** o front lê o token da URL e chama `POST /auth/set-session` `{access_token, refresh_token?}`; depois o usuário define a nova senha.

## 2. Níveis de acesso

| `nivel` | Perfil |
|---|---|
| 0 | SUPER_ADMIN |
| 1 | ADMIN |
| 99 | USUARIO |

Criar, editar e excluir produtos exigem nível 0 ou 1 (senão **403**). Use `nivel` de `/auth/me` só para esconder UI; a validação real é do back.

## 3. Formato de resposta

Sucesso — os dados ficam no mesmo nível de `success`/`message`:
```json
{ "success": true, "message": "…", "user": { "id": "…", "nome": "…", "email": "…", "nivel": 1 } }
```
Erro:
```json
{ "success": false, "statusCode": 400, "message": "…", "error": "Bad Request" }
```
`message` é **array de strings** em erro de validação (um item por campo) e string nos demais casos. Exiba sempre `message`.

| Status | Significado |
|---|---|
| 400 | corpo/parâmetro/arquivo inválido, senha fraca, OTP inválido |
| 401 | sem sessão, token expirado, credenciais erradas |
| 403 | nível insuficiente ou origem não autorizada |
| 429 | rate limit — avise o usuário para aguardar |
| 500 | erro interno (mensagem genérica) |

## 4. Rotas

| Rota | Acesso | Observações |
|---|---|---|
| `POST /auth/login` | público | `{email, senha}`; limite 5/min por IP e 5/15 min por e-mail |
| `POST /auth/refresh` | cookie refresh | sem corpo |
| `POST /auth/logout` | — | limpa cookies |
| `GET /auth/me` | logado | — |
| `POST /auth/esqueci-senha` | público | limite 3/min por IP e 3/15 min por e-mail |
| `POST /auth/redefinir-senha` | público | — |
| `POST /auth/set-session` | público | — |
| `GET /produtos/listagem` | público | só produtos ativos, mais novos primeiro; cada produto traz `produto_imagens[{id, url_path, url_publica}]` — exiba `url_publica` |
| `POST /produtos/criar` | nível 0/1 | **multipart/form-data** |
| `PUT /produtos/:id` | nível 0/1 | **multipart/form-data**; `:id` é UUID |
| `DELETE /produtos/:id` | nível 0/1 | `:id` é UUID |

Detalhes dos campos de cada rota: ver `openapi.json`. O back **rejeita campos desconhecidos** no corpo (400): envie apenas os campos documentados.

### Upload de imagens (criar/editar produto)
- `multipart/form-data`, campo de arquivos **`imagens`** (repetido), até **10 arquivos de 5 MB**.
- O tipo é conferido pelo conteúdo real do arquivo, não pela extensão.
- No `PUT`, imagens já salvas que devem ser mantidas vão em `imagensExistentes`; as que não estiverem nessa lista são removidas.
- Não defina manualmente o header `Content-Type` ao enviar `FormData` (o navegador inclui o boundary).

## 5. Limites gerais
- Rate limit padrão: 100 req/min por IP; respostas **429** devem ser tratadas.
- Corpo JSON máximo: 100 kb.

## 6. Ainda não disponível
- `POST /usuarios/criar` existe no código, mas **não é servida** hoje (não está registrada em módulo). Não construa tela de cadastro dependente dela por enquanto.

## 7. Manutenção do contrato (para o time do back)
Ao mudar rotas/DTOs: regenerar `docs/openapi.json` (subir o back e baixar `/docs-json`) e avisar o front.
