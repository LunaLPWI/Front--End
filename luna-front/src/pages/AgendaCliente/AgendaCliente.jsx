import React, { useEffect, useState } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import styles from './AgendaCliente.module.css';

function AgendaCliente() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

 
    const links = [
        { name: 'DASHBOARD', path: '/financeiro' },
        { name: 'CLIENTES', path: '/gerenciamento-clientes' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'ESTOQUE', path: '/estoque' }
    ];

    // Função de logout
    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Cabeçalhos da tabela
    const headers = ['Horário', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    // Função para formatar hora
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Função para buscar dados da API
    const fetchData = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;

            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const roles = parsedUser?.roles || [];
            const employeeRole = roles.find(role => role === 'ROLE_EMPLOYEE');
            const employeeId = employeeRole ? parsedUser.id : null;

            if (!employeeId) {
                throw new Error('Funcionário não encontrado.');
            }

            const start = new Date();
            const end = new Date();
            end.setDate(end.getDate() + 5);

            const formattedStart = start.toISOString().slice(0, -1);
            const formattedEnd = end.toISOString().slice(0, -1);

            const url = `http://localhost:8080/schedules/busy-schedules-admin?start=${encodeURIComponent(formattedStart)}&end=${encodeURIComponent(formattedEnd)}&employeeId=${employeeId}`;

            console.log('Requisitando dados de:', url);

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
            console.log('Resultado da requisição:', result);

            if (Array.isArray(result)) {
                processResponse(result);
            } else {
                throw new Error('Resposta inesperada da API');
            }
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
            setError(err.message || 'Erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    // Processamento dos dados recebidos da API
    const processResponse = (result) => {
        const transformedData = result.map(schedule => {
            const { startDateTime, clientName, items } = schedule;
            const start = new Date(startDateTime);
            const timeString = formatTime(start);
            const rowData = Array(headers.length - 1).fill('');

            items.forEach(item => {
                const serviceDescription = item;
                const startDay = start.getDay();

                if (startDay >= 2 && startDay <= 6) {
                    rowData[startDay - 2] = (
                        <span className={styles.clientName}>
                            {clientName} - {serviceDescription}
                        </span>
                    );
                }
            });

            return [timeString, ...rowData];
        });

        setData(transformedData);
    };

    // Carregamento inicial dos dados
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleLogoutClick}
            />
            <section className={styles.agendaCliente}>
                <div className={styles.containerAgendaCliente}>
                    <h1 className={styles.titleAgendaCliente}>Agenda do Cliente</h1>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <DynamicTable headers={headers} data={data} useFilter={true} usePagination={true} />
                    )}
                </div>
            </section>
        </div>
    );
}

export default AgendaCliente;
