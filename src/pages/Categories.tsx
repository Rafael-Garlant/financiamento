// src/pages/Categories.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, type Category } from '../services/categoryService';
import { CategoryForm } from '../components/categories/CategoryForm';
import { CategoryList } from '../components/categories/CategoryList';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && true)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setFetching(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setFetching(false);
    }
  }

  async function handleCreateCategory(name: string, description: string) {
    try {
      const newCategory = await categoryService.create(name, description);
      setCategories((prev) => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      alert('Erro ao criar categoria.');
      throw err;
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Deseja realmente excluir esta categoria? Isso apagará todas as parcelas vinculadas a ela.')) return;

    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      alert('Erro ao excluir categoria.');
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf6f9] dark:bg-[#120f13] px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Categorias</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize as divisões do seu contrato</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-bold text-[#ED9BDB] hover:text-[#e483d0] transition-colors"
          >
            ← Voltar para o Início
          </button>
        </div>

        {/* Form Component */}
        <CategoryForm onSubmit={handleCreateCategory} />

        {/* List Component */}
        <CategoryList categories={categories} fetching={fetching} onDelete={handleDeleteCategory} />

      </div>
    </div>
  );
}