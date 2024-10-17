import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Páginas
import App from './App';
import ErrorPage from './pages/errorPage/ErrorPage';
import Home from './pages/home/Home';
import AgendamentoServicos from './pages/AgendamentoServicos/AgendamentoServicos';
import Planos from './pages/planos/Planos';
import Perfil from './pages/perfil/Perfil';
import Agendamento from './pages/Agendamento/Agendamento';
import Login from './pages/Login/Login';
import Cadastro from './pages/CadastroUsuario/Cadastro';
import PaymentForm from './pages/PaymentForm/PaymentForm';

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Define a rota padrão
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
        path: '/agendamentoServicos',
        element: <AgendamentoServicos />,
      },
      {
        path: '/agendamentos',
        element: <Agendamento />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/cadastro',
        element: <Cadastro />,
      },
      {
        path:'/PaymentForm',
        element: <PaymentForm />,
      }

    ],
  },
]);

// Renderizando o aplicativo no DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
