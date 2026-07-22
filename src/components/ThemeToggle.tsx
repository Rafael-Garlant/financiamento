// src/components/ThemeToggle.tsx
import { useState, useEffect } from 'react';

export function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-lg bg-white dark:bg-[#1d181f] border border-slate-200 dark:border-[#2f2532] text-slate-600 dark:text-slate-300 p-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#251e27] transition-all"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
        >
            {isDarkMode ? '☀️ Claro' : '🌙 Escuro'}
        </button>
    );
}