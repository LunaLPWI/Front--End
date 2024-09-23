import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AgendamentoServicos from './pages/AgendamentoServicos/AgendamentoServicos';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/agendamentos" element={<AgendamentoServicos />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
