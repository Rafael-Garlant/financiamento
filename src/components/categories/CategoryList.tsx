// src/components/categories/CategoryList.tsx
import type { Category } from '../../services/categoryService';

interface CategoryListProps {
    categories: Category[];
    fetching: boolean;
    onDelete: (id: string) => void;
}

export function CategoryList({ categories, fetching, onDelete }: CategoryListProps) {
    return (
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Minhas Categorias</h2>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 text-xs font-bold text-[#10b981] border border-emerald-100 dark:border-emerald-900/40">
                    {categories.length} {categories.length === 1 ? 'ativa' : 'ativas'}
                </span>
            </div>

            {fetching ? (
                <p className="text-sm text-slate-400">Carregando categorias...</p>
            ) : categories.length === 0 ? (
                <p className="text-sm text-slate-400">Nenhuma categoria cadastrada ainda.</p>
            ) : (
                <ul className="divide-y divide-slate-100 dark:divide-[#2b222e]">
                    {categories.map((cat) => (
                        <li key={cat.id} className="flex items-center justify-between py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/10 -mx-6 px-6">
                            <div className="pr-4">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</p>
                                {cat.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{cat.description}</p>}
                            </div>
                            <button
                                onClick={() => onDelete(cat.id)}
                                className="rounded-lg bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all"
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}