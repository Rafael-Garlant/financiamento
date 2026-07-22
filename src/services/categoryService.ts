// src/services/categoryService.ts
import { supabase } from '../lib/supabaseClient';

export interface Category {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export const categoryService = {
    // Buscar todas as categorias do usuário logado
    async getAll(): Promise<Category[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado.');

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Criar uma nova categoria
    async create(name: string, description: string = ''): Promise<Category> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado.');

        const { data, error } = await supabase
            .from('categories')
            .insert([
                {
                    name,
                    description,
                    user_id: user.id // Vincula a categoria ao seu usuário logado
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Excluir uma categoria (caso queira deletar depois)
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};