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
    const [selectedClient, setSelectedClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const handleClientClick = (clientData) => {
        setSelectedClient(clientData);
        setIsModalOpen(true);
    };

    const fetchData = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;
            const roles = parsedUser?.roles || [];
            const employeeRole = roles.find(role => role === 'ROLE_EMPLOYEE');
            const employeeId = employeeRole ? parsedUser.id : null;

            if (!token || !employeeId) {
                setError("Erro de autenticação. Faça login novamente.");
                setIsLoading(false);
                return;
            }
            const start = new Date();
            const end = new Date();
            end.setDate(end.getDate() + 5);

            const formattedStart = start.toISOString().slice(0, -1);
            const formattedEnd = end.toISOString().slice(0, -1);

            const url = `http://localhost:8081/schedules/busy-schedules-admin?start=${encodeURIComponent(formattedStart)}&end=${encodeURIComponent(formattedEnd)}&employeeId=${employeeId}`;

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
            const transformedData = transformScheduleData(result);
            setData(transformedData);
        } catch (err) {
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
            const { startDateTime, clientName, items } = schedule;
            const start = new Date(startDateTime);
            const startDay = start.getDay();
            if (startDay < 2 || startDay > 6) return;
            const dayIndex = startDay - 2;
            let currentTime = new Date(start);
            items.forEach((item) => {
                const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                if (!dataMap[timeString]) {
                    dataMap[timeString] = { time: timeString, data: Array(daysOfWeek.length).fill('') };
                }

                if (dayIndex >= 0 && dayIndex < daysOfWeek.length) {
                    const serviceDescription = item;
                    dataMap[timeString].data[dayIndex] = (
                        <span
                            className={styles.clientName}
                            onClick={() => handleClientClick({
                                name: capitalize(clientName),
                                service: capitalize(serviceDescription),
                                time: timeString
                            })}
                        >
                            {capitalize(clientName)} 
                        </span>
                    );
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

    const capitalize = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const ClientModal = ({ isOpen, client, onClose }) => {
        const [leftSideItems, setLeftSideItems] = useState([
            { name: 'Corte de Cabelo Masculino', mark: 'Barbearia Don Roque', qtd: 15, value: 30.00 },
            { name: 'Corte de Cabelo Feminino', mark: 'Barbearia Don Roque', qtd: 10, value: 40.00 },
            { name: 'Barba Completa', mark: 'Barbearia Don Roque', qtd: 20, value: 25.00 },
        ]);
        const [rightSideItems, setRightSideItems] = useState([]);
    
        const addQtdProduct = (name) => {
            setLeftSideItems(prevLeftItems =>
                prevLeftItems.map(item =>
                    item.name === name && item.qtd > 0 ? { ...item, qtd: item.qtd - 1 } : item
                )
            );
    
            const itemToAdd = leftSideItems.find(item => item.name === name);
            if (itemToAdd) {
                setRightSideItems(prevRightItems => {
                    const existingItem = prevRightItems.find(cartItem => cartItem.name === name);
                    if (existingItem) {
                        return prevRightItems.map(cartItem =>
                            cartItem.name === name ? { ...cartItem, qtd: cartItem.qtd + 1 } : cartItem
                        );
                    } else {
                        return [...prevRightItems, { ...itemToAdd, qtd: 1 }];
                    }
                });
            }
        };
    
        const removeQtdProduct = (name) => {
            const itemToRemove = rightSideItems.find(item => item.name === name);
    
            if (itemToRemove) {
                setRightSideItems(prevRightItems =>
                    prevRightItems
                        .map(item =>
                            item.name === name && item.qtd > 0 ? { ...item, qtd: item.qtd - 1 } : item
                        )
                        .filter(item => item.qtd > 0)
                );
    
                setLeftSideItems(prevLeftItems =>
                    prevLeftItems.map(item =>
                        item.name === name ? { ...item, qtd: item.qtd + 1 } : item
                    )
                );
            }
        };
    
        const handleClose = () => {
            if (window.confirm('Você perderá as alterações. Tem certeza que deseja fechar?')) {
                onClose();
            }
        };
    
        if (!isOpen) return null;
    
        return (
            <div className={styles.modalBackdrop}>
                <div className={styles.modalContent}>
                    <h2>Detalhes do Cliente</h2>
                    <p>Nome: {capitalize(client.name)}</p>
                    <p>Serviço: {capitalize(client.service)}</p>
                    <p>Horário: {client.time}</p>
                    <div className={styles.leftSide}>
                        <h3>Produtos do estoque</h3>
                        {leftSideItems.map((item, index) => (
                            <div key={index} className={styles.item}>
                                <p>{capitalize(item.name)}</p>
                                <p>R$ {item.value.toFixed(2)}</p>
                                <p>QTD: {item.qtd}</p>
                                <button onClick={() => addQtdProduct(item.name)}>Adicionar</button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.rightSide}>
                        <h3>Produtos do agendamento</h3>
                        {rightSideItems.map((item, index) => (
                            <div key={index} className={styles.item}>
                                <p>{capitalize(item.name)}</p>
                                <p>R$ {item.value.toFixed(2)}</p>
                                <p>QTD: {item.qtd}</p>
                                <button onClick={() => removeQtdProduct(item.name)}>Remover</button>
                            </div>
                        ))}
                    </div>
                    <button className={styles.closeButton} onClick={handleClose}>Fechar</button>
                    <button>Finalizar</button>
                </div>
            </div>
        );
    };
    
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
                    <h1 className={styles.titleAgendaCliente}>Agenda do Cliente</h1>
                    <div className={styles.tableContainer}>
                        {isLoading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <DynamicTable headers={headers} data={data} />
                        )}
                    </div>
                </div>
            </section>
            <ClientModal isOpen={isModalOpen} client={selectedClient} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default AgendaCliente;
