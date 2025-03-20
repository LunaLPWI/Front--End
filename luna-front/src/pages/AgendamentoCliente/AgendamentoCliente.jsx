import React, { useEffect, useState } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useNavigate } from 'react-router-dom';
import styles from './AgendamentoCliente.module.css';

function AgendamentoCliente() {

    const links = [
        { name: 'PLANOS', path: '/planos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'SERVIÇOS', path: '/serviços' },
        { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
    ];

    const navigate = useNavigate();
    const headers = ['Nome', 'Barbeiro', 'Serviços', 'Data e Hora'];
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const fetchData = async () => {
        try {
            console.log("Iniciando a requisição para carregar a agenda...");

            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;
            const clientId = parsedUser?.id;
            const clientName = parsedUser?.name;

            if (!token || !clientId || !clientName) {
                console.error("Token, Client ID ou Client Name não encontrados.");
                setError("Erro de autenticação. Faça login novamente.");
                setIsLoading(false);
                return;
            }

            const start = new Date();
const formattedStart = start.toISOString().replace("Z", ""); // Apenas remove o "Z"




            console.log("Token:", token);
            console.log("Client ID:", clientId);
            console.log("Client Name:", clientName);
            console.log("Parâmetro start:", formattedStart);

            const url = `http://localhost:8080/schedules/client-schedules?start=${encodeURIComponent(formattedStart)}&clientId=${clientId}`;
            console.log("URL da requisição:", url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Resposta da API:", result);

            const transformedData = transformScheduleData(result, clientName);
            console.log("Dados transformados para a tabela:", transformedData);

            transformedData.sort((a, b) => new Date(b[3]) - new Date(a[3]));

            setData(transformedData);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError(err.message || "Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const transformScheduleData = (schedules, clientName) => {
        return schedules.map(schedule => {
            const { startDateTime, nameEmployee, items } = schedule;

            // Formatar a data para o padrão pt-BR sem o "Z"
            const formattedDate = new Date(startDateTime).toLocaleString('pt-BR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const services = items.map(item =>
                item.description.charAt(0).toUpperCase() + item.description.slice(1).toLowerCase()
            ).join(', ');

            return [
                clientName,
                nameEmployee,
                services,
                formattedDate
            ];
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleLogoutClick}
            />
            <section className={styles.agendamentoCliente}>
                <div className={styles.containerAgendamentoCliente}>
                    <h1>MEUS AGENDAMENTOS</h1>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <DynamicTable headers={headers} data={data} useFilter={false} usePagination={true} />
                    )}
                </div>
            </section>
        </>
    );
}

export default AgendamentoCliente;
