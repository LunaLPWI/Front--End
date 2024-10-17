import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Cadastro from "./pages/CadastroUsuario/Cadastro";
import Login from "./pages/Login/Login";
import AgendamentoServicos from "./pages/AgendamentoServicos/AgendamentoServicos";
import Perfil from "./pages/perfil/Perfil";
import Planos from "./pages/planos/Planos";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/agendamento-servicos" element={<AgendamentoServicos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro/>} />
            </Routes>
        </BrowserRouter>
    );
}