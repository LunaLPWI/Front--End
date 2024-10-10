import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App'; // Certifique-se de que está importando o App corretamente
import ErrorPage from './pages/errorPage/ErrorPage';
import Home from './pages/home/Home';
import AgendamentoServicos from './pages/AgendamentoServicos/AgendamentoServicos';
import Planos from './pages/planos/Planos';
import Perfil from './pages/perfil/Perfil';
import Login from './pages/Login/Login';
import Cadastro from './pages/CadastroUsuario/Cadastro';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement:<ErrorPage />,
    children: [
      {
        path: '/', 
        element: <Home />,
      },
      {
        path: '/planos', 
        element: <Planos />,
      },
      {
        path: '/perfil', 
        element: <Perfil />,
      },
      {
        path: '/agendamento-servicos', 
        element: <AgendamentoServicos />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/cadastro',
        element: <Cadastro />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
