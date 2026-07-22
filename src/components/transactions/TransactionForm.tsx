// src/components/transactions/TransactionForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Category } from '../../services/categoryService';

interface TransactionFormProps {
    categories: Category[];
    onSubmit: (data: {
        category_id: string;
        description: string;
        due_date: string;
        amount_planned: number;
        incc_percentage: number;
        status: 'Pendente' | 'Concluído';
    }) => Promise<void>;
    onNavigateCategories: () => void;
}

export function TransactionForm({ categories, onSubmit, onNavigateCategories }: TransactionFormProps) {
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [amountPlanned, setAmountPlanned] = useState('');
    const [inccPercentage, setInccPercentage] = useState('0');
    const [status, setStatus] = useState<'Pendente' | 'Concluído'>('Pendente');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const activeCatId = categoryId || categories[0]?.id;

        if (!activeCatId || !description || !dueDate || !amountPlanned) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                category_id: activeCatId,
                description,
                due_date: dueDate,
                amount_planned: parseFloat(amountPlanned),
                incc_percentage: parseFloat(inccPercentage) || 0,
                status,
            });

            // Limpar formulário
            setDescription('');
            setDueDate('');
            setAmountPlanned('');
            setInccPercentage('0');
            setStatus('Pendente');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (categories.length === 0) {
        return (
            <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532]">
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                    Você precisa cadastrar pelo menos uma{' '}
                    <span className="font-bold underline cursor-pointer text-[#ED9BDB]" onClick={onNavigateCategories}>
                        categoria
                    </span>{' '}
                    antes de lançar parcelas.
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Lançar Nova Parcela</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Categoria</label>
                    <select
                        value={categoryId || categories[0]?.id}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Descrição / Parcela</label>
                    <input
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Parcela Entrada 05/24"
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data de Vencimento</label>
                    <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Valor Original</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amountPlanned}
                            onChange={(e) => setAmountPlanned(e.target.value)}
                            placeholder="R$ 1500,00"
                            className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">INCC (%)</label>
                            <a href="https://valor.globo.com/valor-data/incc/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#ED9BDB] hover:underline">Consultar Taxa ↗</a>
                        </div>
                        <input
                            type="number"
                            step="0.0001"
                            value={inccPercentage}
                            onChange={(e) => setInccPercentage(e.target.value)}
                            placeholder="0.45"
                            className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status Inicial</label>
                    <div className="mt-2 flex gap-4">
                        <label className="inline-flex items-center text-sm text-slate-700 dark:text-slate-300">
                            <input
                                type="radio"
                                className="text-[#ED9BDB] focus:ring-[#ED9BDB] dark:bg-[#120f13] dark:border-[#2f2532]"
                                checked={status === 'Pendente'}
                                onChange={() => setStatus('Pendente')}
                            />
                            <span className="ml-2">Pendente</span>
                        </label>
                        <label className="inline-flex items-center text-sm text-slate-700 dark:text-slate-300">
                            <input
                                type="radio"
                                className="text-[#ED9BDB] focus:ring-[#ED9BDB] dark:bg-[#120f13] dark:border-[#2f2532]"
                                checked={status === 'Concluído'}
                                onChange={() => setStatus('Concluído')}
                            />
                            <span className="ml-2">Pago (Concluído)</span>
                        </label>
                    </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#ED9BDB] hover:bg-[#e483d0] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-100 dark:shadow-none transition-all disabled:bg-[#f3caec]"
                    >
                        {loading ? 'Lançando...' : 'Adicionar Parcela'}
                    </button>
                </div>
            </form>
        </div>
    );
}