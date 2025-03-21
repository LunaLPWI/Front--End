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
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const links = [
        { name: 'DASHBOARD', path: '/financeiro' },
        { name: 'CLIENTES', path: '/gerenciamento-clientes' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'ESTOQUE', path: '/estoque' }
    ];

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const headers = ['Horário', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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

    const processResponse = (result) => {
        const transformedData = result.map(schedule => {
            const { id, startDateTime, clientName, items } = schedule;
            const start = new Date(startDateTime);
            const timeString = formatTime(start);
            const rowData = Array(headers.length - 1).fill('');

            items.forEach(item => {
                const serviceDescription = item;
                const startDay = start.getDay();

                if (startDay >= 2 && startDay <= 6) {
                    rowData[startDay - 2] = (
                        <span 
                            className={styles.clientName} 
                            onClick={() => setSelectedSchedule({ id, clientName })}
                        >
                            {clientName} - {serviceDescription}
                        </span>
                    );
                }
            });

            return [timeString, ...rowData];
        });

        setData(transformedData);
    };

    const handleDelete = async () => {
        if (!selectedSchedule) return;

        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;

            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const url = `http://localhost:8080/schedules/${selectedSchedule.id}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao deletar: ${response.status} ${response.statusText}`);
            }

            console.log(`Agendamento ${selectedSchedule.id} deletado com sucesso!`);
            setSelectedSchedule(null);
            fetchData(); // Atualiza a tabela após deletar
        } catch (err) {
            console.error('Erro ao deletar agendamento:', err);
        }
    };

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
                    <h1 className={styles.titleAgendaCliente}>Agenda dos Clientes</h1>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <DynamicTable headers={headers} data={data} useFilter={true} usePagination={true} />
                    )}
                </div>
            </section>

            {/* Modal de Exclusão */}
            {selectedSchedule && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <h2 className={styles.modalTitle}>Cancelar Agendamento</h2>
                        <p>Tem certeza que deseja cancelar o agendamento de <strong>{selectedSchedule.clientName}</strong>?</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelButton} onClick={handleDelete}>
                                Cancelar Agendamento
                            </button>
                            <button className={styles.backButton} onClick={() => setSelectedSchedule(null)}>
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgendaCliente;
