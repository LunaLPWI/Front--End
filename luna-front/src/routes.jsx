import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { RedefinirSenha } from "./pages/RedefinirSenha/RedefinirSenha";
import Login from "./pages/Login/Login";
import AgendamentoServicos from "./pages/AgendamentoServicos/AgendamentoServicos";
import Agendamento from "./pages/Agendamento/Agendamento";
import AgendamentoCliente from "./pages/AgendamentoCliente/AgendamentoCliente";
import AgendaCliente from "./pages/AgendaCliente/AgendaCliente"
import Financeiro from "./pages/Financeiro/TempFinanceiro"
import Perfil from "./pages/Perfil/Perfil";
import { Estoque } from "./pages/Estoque/Estoque";
import Planos from "./pages/Planos/Planos";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import GerenciamentoCliente from "./pages/GerenciamentoCliente/GerenciamentoCliente";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import { RotaPrivada } from "./utils/global";
import { CadastroFuncionario } from "./pages/CadastroFuncionario/CadastroFuncionario";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/planos"
                    element={
                        <RotaPrivada>
                            <Planos />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/perfil"
                    element={
                        <RotaPrivada>
                            <Perfil />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/serviços"
                    element={
                        <RotaPrivada>
                            <AgendamentoServicos />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/agendamentos"
                    element={
                        <RotaPrivada>
                            <Agendamento />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/agenda-clientes"
                    element={
                        <RotaPrivada>
                            <AgendaCliente />
                        </RotaPrivada>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route
                    path="/gerenciamento-clientes"
                    element={
                        <RotaPrivada>
                            <GerenciamentoCliente />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/criar-funcionario"
                    element={
                        <RotaPrivada>
                            <CadastroFuncionario />
                        </RotaPrivada>
                    }
                />
                <Route
                    path="/estoque"
                    element={
                        <RotaPrivada>
                        <Estoque />
                        </RotaPrivada>
                    }
                />
            <Route
                path="/financeiro"
                element={<RotaPrivada>
                    <Financeiro />
                    </RotaPrivada>}
            />
            <Route
                path="/meus-agendamentos"
                element={<RotaPrivada>
                    <AgendamentoCliente />
                    </RotaPrivada>}
            />
            </Routes>

        </BrowserRouter>
    );
}