
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js'; import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function initializeAuth() {
            try {
                // 1. Verifica se já existe uma sessão ativa
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    if (isMounted) {
                        setUser(session.user);
                        setLoading(false);
                    }
                    return;
                }

                // 2. Se não houver sessão ativa, tenta login automático
                const autoEmail = import.meta.env.VITE_AUTO_LOGIN_EMAIL;
                const autoPassword = import.meta.env.VITE_AUTO_LOGIN_PASSWORD;

                if (autoEmail && autoPassword) {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: autoEmail,
                        password: autoPassword,
                    });

                    if (error) {
                        console.error('Falha no login automático:', error.message);
                    } else if (data?.user) {
                        if (isMounted) {
                            setUser(data.user);
                        }
                    }
                } else {
                    console.warn(
                        'Login automático não configurado no .env.local (adicione VITE_AUTO_LOGIN_EMAIL e VITE_AUTO_LOGIN_PASSWORD).'
                    );
                }
            } catch (err) {
                console.error('Erro na inicialização da autenticação:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        initializeAuth();

        // 3. Escuta mudanças no estado de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar o contexto facilmente nos componentes
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}