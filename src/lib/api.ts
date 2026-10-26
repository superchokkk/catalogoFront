const API_URL = import.meta.env.VITE_API_URL;

/** Chamado quando o refresh falha: a sessão acabou. Registrado pelo AuthProvider. */
let aoSessaoExpirar: (() => void) | null = null;
export function registrarSessaoExpirada(fn: (() => void) | null) {
  aoSessaoExpirar = fn;
}

let refreshEmAndamento: Promise<boolean> | null = null;

function renovarSessao(): Promise<boolean> {
  // Evita vários /auth/refresh simultâneos quando várias requisições recebem 401 juntas.
  refreshEmAndamento ??= fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshEmAndamento = null;
    });
  return refreshEmAndamento;
}

/**
 * fetch para a API: sempre envia cookies e, em 401, tenta `POST /auth/refresh`
 * e repete a requisição uma única vez. Não defina Content-Type ao enviar FormData.
 * `semRefresh` desativa esse comportamento (login, me, etc.).
 */
export async function apiFetch(
  caminho: string,
  init: RequestInit = {},
  semRefresh = false,
): Promise<Response> {
  const requisitar = () => fetch(`${API_URL}/api${caminho}`, { ...init, credentials: 'include' });

  const resposta = await requisitar();
  if (resposta.status !== 401 || semRefresh) return resposta;

  if (await renovarSessao()) return requisitar();

  aoSessaoExpirar?.();
  return resposta;
}

/** Extrai `message` (string ou lista de strings) de uma resposta de erro da API. */
export async function mensagemDeErro(resposta: Response, padrao: string): Promise<string> {
  const dados = await resposta.json().catch(() => null);
  const msg = dados?.message;
  if (Array.isArray(msg)) return msg.join('\n');
  if (typeof msg === 'string' && msg) return msg;
  if (resposta.status === 429) return 'Muitas tentativas. Aguarde um instante e tente novamente.';
  if (resposta.status === 403) return 'Você não tem permissão para esta ação.';
  return padrao;
}

export function jsonBody(corpo: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  };
}
