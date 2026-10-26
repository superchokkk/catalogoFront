import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch, jsonBody, mensagemDeErro } from '../lib/api';

type Estado = 'validando' | 'ok' | 'erro';

function UpdatePassword() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState<Estado>('validando');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // O link do e-mail traz o token na query (?access_token=) ou no fragmento (#access_token=).
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = searchParams.get('access_token') ?? hash.get('access_token');
    const refreshToken = searchParams.get('refresh_token') ?? hash.get('refresh_token');

    if (!accessToken) {
      setEstado('erro');
      setMensagem('Token inválido ou ausente. Solicite um novo link.');
      return;
    }

    // Evita deixar o token na barra de endereço/histórico depois de lido.
    window.history.replaceState(null, '', window.location.pathname);

    apiFetch(
      '/auth/set-session',
      jsonBody({ access_token: accessToken, ...(refreshToken ? { refresh_token: refreshToken } : {}) }),
      true,
    )
      .then(async (res) => {
        if (res.ok) {
          setEstado('ok');
        } else {
          setEstado('erro');
          setMensagem(await mensagemDeErro(res, 'Link inválido ou expirado.'));
        }
      })
      .catch(() => {
        setEstado('erro');
        setMensagem('Não foi possível conectar ao servidor.');
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-4">
        {estado === 'validando' && <p className="opacity-70">Validando link...</p>}
        {estado === 'ok' && <p>Sessão confirmada. Você já pode voltar ao catálogo.</p>}
        {estado === 'erro' && <p className="text-red-500">{mensagem}</p>}
        <Link to="/" className="text-primary hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}

export default UpdatePassword;
