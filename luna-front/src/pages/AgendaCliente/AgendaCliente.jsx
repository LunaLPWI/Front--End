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

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user.roles.includes('ROLE_ADMIN')) setIsAdmin(true);
    }, [user.roles]);

    let links = [];
    if (isAdmin) {
        links = [
            { name: 'DASHBOARD', path: '/financeiro' },
            { name: 'PERFIL', path: '/perfil' },
            { name: 'GERENCIAMENTO', path: '/agenda-clientes' },
            { name: 'AGENDA', path: '/agenda-clientes' }
        ]
    } else {
        links = [
            { name: '', path: '/serviços' },
            { name: '', path: '/perfil' },
            { name: '', path: '/agendamentos' },
            { name: '', path: '/meus-agendamentos' }
        ]
    }

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const generateHeaders = () => {
        const today = new Date();
        const headers = ['Horário'];

        for (let i = 2; i <= 6; i++) {
            const date = new Date();
            date.setDate(today.getDate() + (i - today.getDay()));

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');

            const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            headers.push(`${dayNames[i]} ${day}/${month}`);
        }

        return headers;
    };

    const headers = generateHeaders();

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
        const today = new Date();
        const transformedData = result.map(schedule => {
            const { id, startDateTime, endDateTime, clientName, items } = schedule;
            const start = new Date(startDateTime);
            const timeString = formatTime(start);
            const end = new Date(endDateTime);
            const endTimeString = formatTime(end); // Formato do horário de término

            // Array com espaço para os 5 dias úteis (terça a sábado)
            const rowData = Array(5).fill('');

            // Criação de uma string com todos os serviços separados por vírgula
            const serviceDescription = items.join(', '); // Junta todos os serviços com vírgula

            // Percorre os itens (serviços) e coloca na data correta
            items.forEach(item => {
                const startDay = start.getDay(); // 0 = Domingo, 1 = Segunda, etc.

                // Ajustar o cálculo do índice: Terça-feira é o índice 0, etc.
                if (startDay >= 2 && startDay <= 6) {
                    // O índice do dia na tabela é startDay - 2 (pois o primeiro dia é terça-feira)
                    const dayIndex = startDay - 2;

                    rowData[dayIndex] = (
                        <span
                            className={styles.clientName}
                            onClick={() => setSelectedSchedule({ id, clientName, items, timeString, endTimeString })}
                        >
                            {clientName} - {serviceDescription}
                        </span>
                    );
                }
            });

            // Retorna o horário e os dados da tabela (terça a sábado)
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
                    <h1 className={styles.titleAgendaCliente}>AGENDA DOS CLIENTES</h1>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <DynamicTable headers={headers} data={data} useFilter={true} usePagination={true} />
                    )}
                </div>
            </section>

            {/* Modal de Exibição de Agendamento */}
            {selectedSchedule && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <h2 className={styles.modalTitle}>Detalhes do Agendamento</h2>
                        <div className={styles.modalContent}>
                            <p><strong className="strong">Nome do Cliente:</strong> {selectedSchedule.clientName}</p>
                            <p><strong className="strong">Serviços:</strong></p>
                            <ul>
                                {selectedSchedule.items && selectedSchedule.items.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                            {selectedSchedule.endTimeString && (
                                <p><strong className="strong">Encerramento:</strong> {selectedSchedule.endTimeString}</p>
                            )}
                        </div>
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
