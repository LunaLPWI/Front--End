import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import {RedefinirSenha} from "./pages/RedefinirSenha/RedefinirSenha";
import Login from "./pages/Login/Login";
import AgendamentoServicos from "./pages/AgendamentoServicos/AgendamentoServicos";
import Agendamento from "./pages/Agendamento/Agendamento";
import AgendaCliente from "./pages/AgendaCliente/AgendaCliente"
import Perfil from "./pages/Perfil/Perfil";
import Planos from "./pages/Planos/Planos";
import GerenciamentoCliente from "./pages/GerenciamentoCliente/GerenciamentoCliente";
import { Cadastro } from "./pages/Cadastro/Cadastro";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/agendamento-servicos" element={<AgendamentoServicos />} />
                <Route path="/agendamentos" element={<Agendamento />} />
                <Route path="/agenda-clientes" element={<AgendaCliente />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro/>} />
                <Route path="/redefinir-senha" element={<RedefinirSenha/>} />
                <Route path="/gerenciamento-clientes" element={<GerenciamentoCliente />} />
            </Routes>
        </BrowserRouter>
    );
}