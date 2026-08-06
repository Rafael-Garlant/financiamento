// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService, type Transaction } from '../services/transactionService';
import { categoryService, type Category } from '../services/categoryService';
import { ThemeToggle } from '../components/ThemeToggle';
import { CategoryFilter } from '../components/dashboard/CategoryFilter';

export function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [transData, catData] = await Promise.all([
          transactionService.getAll(),
          categoryService.getAll(),
        ]);
        setTransactions(transData);
        setCategories(catData);
      } catch (err) {
        console.error('Erro ao carregar dados do painel:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const filteredTransactions = selectedCategory === 'all'
    ? transactions
    : transactions.filter((tx) => tx.category_id === selectedCategory);

  const sortedFilteredTransactions = [...filteredTransactions].sort(
    (a, b) => b.due_date.localeCompare(a.due_date)
  );

  const totalPaid = filteredTransactions
    .filter((tx) => tx.status === 'Concluído')
    .reduce((acc, curr) => acc + Number(curr.amount_paid || curr.amount_adjusted), 0);

  const totalPending = filteredTransactions
    .filter((tx) => tx.status === 'Pendente')
    .reduce((acc, curr) => acc + Number(curr.amount_adjusted), 0);

  const totalContract = totalPaid + totalPending;

  const progressPercentage = totalContract > 0
    ? Math.round((totalPaid / totalContract) * 100)
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const currentCategoryName = selectedCategory === 'all'
    ? 'Visão Geral (Todas as Categorias)'
    : categories.find((c) => c.id === selectedCategory)?.name || 'Categoria';

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#faf6f9] dark:bg-[#120f13]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ED9BDB] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f9] dark:bg-[#120f13] px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Viva <span className="text-[#ED9BDB]">Penha</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seu painel financeiro particular</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* O botão "Sair" foi removido daqui! */}
          </div>
        </div>

        {/* Componente Reutilizável de Filtro */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Card do Progresso */}
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Progresso: <span className="text-[#ED9BDB]">{currentCategoryName}</span>
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-bold text-[#10b981] border border-emerald-100 dark:border-emerald-900/50">
              {progressPercentage}% Quitado
            </span>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#2b222e]">
            <div
              className="h-full bg-gradient-to-r from-[#ED9BDB] to-[#e483d0] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-400 dark:text-slate-400">
            <div>
              <p>Total Previsto da Categoria:</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{formatCurrency(totalContract)}</p>
            </div>
            <div className="text-right">
              <p>Total de Lançamentos:</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'parcela' : 'parcelas'}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Balanço */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] flex items-center justify-between transition-colors">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Pago</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-3">
              <span className="text-xl text-[#10b981]">✔</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] flex items-center justify-between transition-colors">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">A Pagar (Pendente)</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{formatCurrency(totalPending)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-3">
              <span className="text-xl text-amber-500">⏳</span>
            </div>
          </div>
        </div>

        {/* Lista das Parcelas Filtradas */}
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Lançamentos em <span className="text-[#ED9BDB]">{currentCategoryName}</span>
          </h3>

          {sortedFilteredTransactions.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Nenhum lançamento encontrado para esta categoria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-[#2b222e]">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <th className="pb-3">Descrição / Vencimento</th>
                    <th className="pb-3 text-right">Valor Final</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2b222e] text-sm">
                  {sortedFilteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{tx.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Vence: {new Date(tx.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </p>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(tx.amount_adjusted)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${tx.status === 'Concluído'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#10b981] border-emerald-100 dark:border-emerald-900/40'
                            : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                            }`}
                        >
                          {tx.status === 'Concluído' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botões de Navegação */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
          <button
            onClick={() => navigate('/transacoes')}
            className="w-full rounded-lg bg-[#ED9BDB] hover:bg-[#e483d0] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-100 dark:shadow-none hover:shadow-pink-200/50 transition-all text-center"
          >
            Acessar Parcelas & Lançamentos
          </button>

          <button
            onClick={() => navigate('/categorias')}
            className="w-full rounded-lg bg-white dark:bg-[#1d181f] border border-[#f3caec] dark:border-[#2f2532] hover:bg-[#faf6f9] dark:hover:bg-[#251e27] px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all text-center"
          >
            Configurar Categorias
          </button>
        </div>

      </div>
    </div>
  );
}