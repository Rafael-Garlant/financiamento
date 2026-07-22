// src/pages/Transactions.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService, type Transaction } from '../services/transactionService';
import { categoryService, type Category } from '../services/categoryService';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionTable } from '../components/transactions/TransactionTable';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && true)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      setFetching(true);
      const [transData, catData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
      ]);
      setTransactions(transData);
      setCategories(catData);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setFetching(false);
    }
  }

  async function handleCreateTransaction(data: {
    category_id: string;
    description: string;
    due_date: string;
    amount_planned: number;
    incc_percentage: number;
    status: 'Pendente' | 'Concluído';
  }) {
    try {
      const newTx = await transactionService.create({
        ...data,
        amount_paid: data.status === 'Concluído' ? data.amount_planned * (1 + data.incc_percentage / 100) : null,
        payment_date: data.status === 'Concluído' ? data.due_date : null,
      });

      setTransactions((prev) =>
        [...prev, newTx].sort((a, b) => b.due_date.localeCompare(a.due_date))
      );
    } catch (err) {
      alert('Erro ao cadastrar parcela.');
      throw err;
    }
  }

  async function handleToggleStatus(tx: Transaction) {
    const nextStatus = tx.status === 'Pendente' ? 'Concluído' : 'Pendente';
    const amountPaid = nextStatus === 'Concluído' ? tx.amount_adjusted : null;
    const paymentDate = nextStatus === 'Concluído' ? new Date().toISOString().split('T')[0] : null;

    try {
      const updatedTx = await transactionService.update(tx.id, {
        status: nextStatus,
        amount_paid: amountPaid,
        payment_date: paymentDate,
      });
      setTransactions((prev) => prev.map((t) => (t.id === tx.id ? updatedTx : t)));
    } catch (err) {
      alert('Erro ao atualizar status.');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta parcela permanentemente?')) return;
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Erro ao excluir parcela.');
      console.error(err);
    }
  }

  const filteredTransactions = selectedCategoryFilter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.category_id === selectedCategoryFilter);

  const sortedFilteredTransactions = [...filteredTransactions].sort(
    (a, b) => b.due_date.localeCompare(a.due_date)
  );

  const currentCategoryName = selectedCategoryFilter === 'all'
    ? 'Todas as Categorias'
    : categories.find((c) => c.id === selectedCategoryFilter)?.name || 'Categoria';

  return (
    <div className="min-h-screen bg-[#faf6f9] dark:bg-[#120f13] px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Parcelas e Lançamentos</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gerencie a evolução financeira do seu Viva Penha</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-bold text-[#ED9BDB] hover:text-[#e483d0] transition-colors"
          >
            ← Voltar para o Início
          </button>
        </div>

        {/* Componente do Formulário */}
        <TransactionForm
          categories={categories}
          onSubmit={handleCreateTransaction}
          onNavigateCategories={() => navigate('/categorias')}
        />

        {/* Seletor de Categoria */}
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-4 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visualizar Parcelas De:
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedCategoryFilter === 'all'
                    ? 'bg-[#ED9BDB] text-white shadow-md shadow-pink-100 dark:shadow-none'
                    : 'bg-slate-100 dark:bg-[#2f2532] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3d3041]'
                  }`}
              >
                Todas ({transactions.length})
              </button>

              {categories.map((cat) => {
                const count = transactions.filter((t) => t.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedCategoryFilter === cat.id
                        ? 'bg-[#ED9BDB] text-white shadow-md shadow-pink-100 dark:shadow-none'
                        : 'bg-slate-100 dark:bg-[#2f2532] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3d3041]'
                      }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Componente da Tabela */}
        <TransactionTable
          transactions={sortedFilteredTransactions}
          currentCategoryName={currentCategoryName}
          fetching={fetching}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

      </div>
    </div>
  );
}