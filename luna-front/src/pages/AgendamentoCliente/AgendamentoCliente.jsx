import React, { useEffect, useState } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useNavigate } from 'react-router-dom';
import styles from './AgendamentoCliente.module.css';

function AgendamentoCliente() {
    const links = [
        { name: 'AGENDAR', path: '/agendamentos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'SERVIÇOS', path: '/serviços' },
        { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
    ];

    const navigate = useNavigate();
    const headers = ['Nome', 'Barbeiro', 'Serviços', 'Data e Hora', 'Ações'];
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const fetchData = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;
            const clientId = parsedUser?.id;
            const clientName = parsedUser?.name;

            if (!token || !clientId || !clientName) {
                setError("Erro de autenticação. Faça login novamente.");
                setIsLoading(false);
                return;
            }

            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const formattedStart = start.toISOString().split('T')[0] + 'T00:00:00';

            const url = `http://localhost:8080/schedules/client-schedules?start=${encodeURIComponent(formattedStart)}&clientId=${clientId}`;
            
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
            const transformedData = transformScheduleData(result, clientName);
            transformedData.sort((a, b) => new Date(b[3]) - new Date(a[3]));
            setData(transformedData);
        } catch (err) {
            setError(err.message || "Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSchedule = async (id) => {
        if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) return;
        
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;
            
            if (!token) {
                alert("Erro de autenticação. Faça login novamente.");
                return;
            }

            const response = await fetch(`http://localhost:8080/schedules?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir agendamento.");
            }

            setData(prevData => prevData.filter(schedule => schedule[4] !== id));
            alert("Agendamento excluído com sucesso.");
        } catch (err) {
            alert(err.message || "Erro desconhecido.");
        }
    };

    const transformScheduleData = (schedules, clientName) => {
        return schedules.map(schedule => {
            const { id, startDateTime, nameEmployee, items } = schedule;
            const formattedDate = new Date(startDateTime).toLocaleString('pt-BR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            const services = items.map(item => item.description.charAt(0).toUpperCase() + item.description.slice(1).toLowerCase()).join(', ');
            return [
                clientName,
                nameEmployee,
                services,
                formattedDate,
                <button className={styles.deleteButton} onClick={() => deleteSchedule(id)}>CANCELAR</button>
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
                        <DynamicTable headers={headers} data={data} useFilter={true} usePagination={true} />
                    )}
                </div>
            </section>
        </>
    );
}

export default AgendamentoCliente;
