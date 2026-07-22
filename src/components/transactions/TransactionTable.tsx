// src/components/transactions/TransactionTable.tsx
import type { Transaction } from '../../services/transactionService';

interface TransactionTableProps {
    transactions: Transaction[];
    currentCategoryName: string;
    fetching: boolean;
    onToggleStatus: (tx: Transaction) => void;
    onDelete: (id: string) => void;
}

export function TransactionTable({
    transactions,
    currentCategoryName,
    fetching,
    onToggleStatus,
    onDelete,
}: TransactionTableProps) {
    const formatCurrency = (val: number | null) => {
        if (val === null || isNaN(val)) return '—';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    Lançamentos: <span className="text-[#ED9BDB]">{currentCategoryName}</span>
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                    {transactions.length} {transactions.length === 1 ? 'item' : 'itens'}
                </span>
            </div>

            {fetching ? (
                <p className="text-sm text-slate-400">Carregando parcelas...</p>
            ) : transactions.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">Nenhuma parcela encontrada para esta categoria.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-[#2b222e]">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                <th className="pb-3">Descrição / Vencimento</th>
                                <th className="pb-3">Categoria</th>
                                <th className="pb-3 text-right">Valor Final</th>
                                <th className="pb-3 text-center">Status</th>
                                <th className="pb-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#2b222e] text-sm">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                    <td className="py-4">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{tx.description}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                            Vence: {new Date(tx.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </p>
                                    </td>
                                    <td className="py-4 text-slate-600 dark:text-slate-400 font-medium">
                                        {tx.categories?.name}
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(tx.amount_adjusted)}</p>
                                        {tx.incc_percentage > 0 && (
                                            <p className="text-[10px] text-[#10b981] font-semibold">
                                                INCC (+{tx.incc_percentage}%) • Original: {formatCurrency(tx.amount_planned)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="py-4 text-center">
                                        <button
                                            onClick={() => onToggleStatus(tx)}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold transition-all border ${tx.status === 'Concluído'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#10b981] border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/50'
                                                    : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40 hover:bg-amber-100/50'
                                                }`}
                                        >
                                            {tx.status === 'Concluído' ? 'Pago' : 'Pendente'}
                                        </button>
                                    </td>
                                    <td className="py-4 text-right space-x-2">
                                        <button
                                            onClick={() => onDelete(tx.id)}
                                            className="rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-1 text-xs font-semibold transition-all"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}