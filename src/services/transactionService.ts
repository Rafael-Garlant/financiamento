// src/services/transactionService.ts
import { supabase } from '../lib/supabaseClient';

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  description: string;
  due_date: string;
  amount_planned: number;
  incc_percentage: number;
  amount_adjusted: number;
  payment_date: string | null;
  amount_paid: number | null;
  status: 'Pendente' | 'Concluído';
  created_at: string;
  categories?: {
    name: string;
  };
}

export const transactionService = {
  // Buscar todas as transações do usuário logado
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('due_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Criar uma nova transação (calculando o valor reajustado opcionalmente)
  async create(payload: {
    category_id: string;
    description: string;
    due_date: string;
    amount_planned: number;
    incc_percentage?: number;
    payment_date?: string | null;
    amount_paid?: number | null;
    status?: 'Pendente' | 'Concluído';
  }): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado.');

    const incc = payload.incc_percentage || 0;
    // Calcula o valor reajustado: ValorPlanejado * (1 + INCC/100)
    const amount_adjusted = payload.amount_planned * (1 + incc / 100);

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          category_id: payload.category_id,
          description: payload.description,
          due_date: payload.due_date,
          amount_planned: payload.amount_planned,
          incc_percentage: incc,
          amount_adjusted: Number(amount_adjusted.toFixed(2)),
          payment_date: payload.payment_date || null,
          amount_paid: payload.amount_paid || null,
          status: payload.status || 'Pendente'
        }
      ])
      .select('*, categories(name)')
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar transação (útil para dar baixa / pagar ou alterar dados)
  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    // Se o valor planejado ou o INCC mudaram, recalcula o valor ajustado
    if (updates.amount_planned !== undefined || updates.incc_percentage !== undefined) {
      const current = await supabase.from('transactions').select('*').eq('id', id).single();
      if (current.data) {
        const amt = updates.amount_planned !== undefined ? updates.amount_planned : current.data.amount_planned;
        const incc = updates.incc_percentage !== undefined ? updates.incc_percentage : current.data.incc_percentage;
        updates.amount_adjusted = Number((amt * (1 + incc / 100)).toFixed(2));
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select('*, categories(name)')
      .single();

    if (error) throw error;
    return data;
  },

  // Excluir uma transação
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};