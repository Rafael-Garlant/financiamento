// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Transactions } from './pages/Transactions';
import { Login } from './pages/Login';
import { AuthProvider } from './context/AuthContext';

import { useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#faf6f9] dark:bg-[#120f13]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ED9BDB] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas abertas diretamente, sem barreiras ou redirecionamentos */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/transacoes" element={<Transactions />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}