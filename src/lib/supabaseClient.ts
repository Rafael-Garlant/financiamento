// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// O Vite exige o prefixo VITE_ para expor variáveis de ambiente no front-end
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Erro: As chaves do Supabase não foram encontradas no arquivo .env.local.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);