import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Transactions } from './pages/Transactions';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/transacoes" element={<Transactions />} />

        {/* Essa rota curinga garante que qualquer link quebrado (como o antigo /login) 
            redirecione a pessoa de volta para a tela inicial automaticamente */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}