import React, { useEffect, useState } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useNavigate } from 'react-router-dom';
import styles from './AgendaCliente.module.css';

function AgendaCliente() {
    const links = [];
    const navigate = useNavigate();
    const headers = ['Horário', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

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
            const roles = parsedUser?.roles || [];
            const employeeRole = roles.find(role => role === 'ROLE_EMPLOYEE');
            const employeeId = employeeRole ? parsedUser.id : null;

            if (!token || !employeeId) {
                console.error("Token ou Employee ID não encontrados.");
                setError("Erro de autenticação. Faça login novamente.");
                setIsLoading(false);
                return;
            }

            const start = new Date();
            const end = new Date();
            end.setDate(end.getDate() + 5);

            const formattedStart = start.toISOString().slice(0, -1); 
            const formattedEnd = end.toISOString().slice(0, -1); 

            console.log("Token:", token);
            console.log("Employee ID:", employeeId);
            console.log("Parâmetro start:", formattedStart);
            console.log("Parâmetro end:", formattedEnd);

            const url = `http://localhost:8081/schedules/busy-schedules-admin?start=${encodeURIComponent(formattedStart)}&end=${encodeURIComponent(formattedEnd)}&employeeId=${employeeId}`;
            console.log("URL da requisição:", url); 
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Status da resposta:", response.status);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Resposta da API:", result);

            const transformedData = transformScheduleData(result);
            console.log("Dados transformados para a tabela:", transformedData);
            setData(transformedData);
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError(err.message || "Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const transformScheduleData = (schedules) => {
        const daysOfWeek = ['Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const timeSlots = generateTimeSlots(); 
        const dataMap = {};
    
        schedules.forEach(schedule => {
            const { startDateTime, endDateTime, clientName, items } = schedule;
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
    
            const startDay = start.getDay();
            if (startDay < 2 || startDay > 6) return;  
    
            const dayIndex = startDay - 2; 
    
            let currentTime = new Date(start);
    
            items.forEach((item, index) => {
                const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                if (!dataMap[timeString]) {
                    dataMap[timeString] = { time: timeString, data: Array(daysOfWeek.length).fill('') };
                }
    
                if (dayIndex >= 0 && dayIndex < daysOfWeek.length) {
                    const serviceDescription = item;
                    dataMap[timeString].data[dayIndex] = `${clientName} (${serviceDescription})`;
                }
    
                currentTime.setMinutes(currentTime.getMinutes() + 45);
            });
        });
    
        return timeSlots.map(slot => {
            const row = dataMap[slot] || { time: slot, data: Array(daysOfWeek.length).fill('') };
            return [row.time, ...row.data];
        });
    };
    
    const generateTimeSlots = () => {
        const timeSlots = [];
        let currentTime = new Date();
        currentTime.setHours(9, 0, 0, 0); 
        while (currentTime.getHours() < 20 || (currentTime.getHours() === 20 && currentTime.getMinutes() === 0)) {
            timeSlots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            currentTime.setMinutes(currentTime.getMinutes() + 45); 
        }
    
        return timeSlots;
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
            <section className={styles.agendaCliente}>
                <div className={styles.containerAgendaCliente}>
                    <h1>AGENDA DOS CLIENTES</h1>
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

export default AgendaCliente;
