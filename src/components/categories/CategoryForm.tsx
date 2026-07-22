// src/components/categories/CategoryForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

interface CategoryFormProps {
    onSubmit: (name: string, description: string) => Promise<void>;
}

export function CategoryForm({ onSubmit }: CategoryFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onSubmit(name, description);
            setName('');
            setDescription('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-[#1d181f] p-6 shadow-md shadow-purple-100/40 dark:shadow-none border border-[#f5eef3] dark:border-[#2f2532] transition-colors">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                Nova Categoria
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse"></span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Nome da Categoria
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Parcelas de Entrada, Evolução de Obra"
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Descrição (Opcional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Custos pagos diretamente à construtora..."
                        className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-[#2f2532] bg-white dark:bg-[#120f13] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ED9BDB] focus:outline-none focus:ring-2 focus:ring-[#ED9BDB]/20 transition-all"
                        rows={2}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#ED9BDB] hover:bg-[#e483d0] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-100 dark:shadow-none transition-all disabled:bg-[#f3caec]"
                >
                    {loading ? 'Salvando...' : 'Adicionar Categoria'}
                </button>
            </form>
        </div>
    );
}