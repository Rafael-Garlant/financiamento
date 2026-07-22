// src/components/dashboard/CategoryFilter.tsx
import type { Category } from '../../services/categoryService';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-4 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Filtrar Dashboard por Categoria:
                </label>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onSelectCategory('all')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedCategory === 'all'
                                ? 'bg-[#ED9BDB] text-white shadow-md shadow-pink-100 dark:shadow-none'
                                : 'bg-slate-100 dark:bg-[#2f2532] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3d3041]'
                            }`}
                    >
                        Geral (Todas)
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedCategory === cat.id
                                    ? 'bg-[#ED9BDB] text-white shadow-md shadow-pink-100 dark:shadow-none'
                                    : 'bg-slate-100 dark:bg-[#2f2532] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#3d3041]'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}