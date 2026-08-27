import { createClient } from '@supabase/supabase-js';

// O Vite exige o import.meta.env para ler as variáveis do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as variáveis estiverem vazias, o Vite não vai quebrar a tela inteira, mas vai dar um console.error para você saber
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis do Supabase estão ausentes no arquivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);