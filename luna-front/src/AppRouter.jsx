import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgendamentoServicos from './pages/SelecaoPlanos/SelecaoPlanos';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/AgendamentoServicos" element={<AgendamentoServicos />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
