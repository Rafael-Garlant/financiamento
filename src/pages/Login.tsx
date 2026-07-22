// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Mantém a tela de login no mesmo tema que o usuário deixou salvo por padrão
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && true)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          alert('Cadastro realizado com sucesso! Você já pode entrar.');
          setIsRegistering(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf6f9] dark:bg-[#120f13] px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-[#1d181f] p-8 shadow-xl shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Viva <span className="text-[#ED9BDB]">Penha</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            {isRegistering ? 'Crie sua conta para gerenciar seu financiamento' : 'Acesse seu painel financeiro'}
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4 rounded-md">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-[#ED9BDB] hover:bg-[#e483d0] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-pink-100 dark:shadow-none hover:shadow-pink-200/50 transition-all"
            >
              {loading ? 'Aguarde...' : isRegistering ? 'Cadastrar' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-sm font-semibold text-[#ED9BDB] hover:text-[#e483d0] transition-colors"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
            }}
          >
            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}