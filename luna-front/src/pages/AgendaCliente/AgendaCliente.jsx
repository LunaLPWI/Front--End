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
    const [stockItems, setStockItems] = useState([]);

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
            console.log("Start date:", formattedStart, "End date:", formattedEnd);

            const url = `http://localhost:8081/schedules/busy-schedules-admin?start=${encodeURIComponent(formattedStart)}&end=${encodeURIComponent(formattedEnd)}&employeeId=${employeeId}`;
            console.log("Request URL:", url);

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
            console.log("Response data:", result);

            const transformedData = transformScheduleData(result);
            console.log("Transformed data:", transformedData);

            setData(transformedData);
        } catch (err) {
            console.error("Error:", err.message || "Erro desconhecido.");
            setError(err.message || "Erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStockItems = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser?.token;

            if (!token) {
                setError("Erro de autenticação. Faça login novamente.");
                return;
            }

            const response = await fetch('http://localhost:8081/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição de produtos: ${response.status} ${response.statusText}`);
            }

            const products = await response.json();
            console.log("Produtos retornados pela API:", products);

            if (products.length === 0) {
                console.log("Nenhum produto disponível.");
            } else {
                console.log("Produtos carregados:", products);
            }

            setStockItems(products);
        } catch (err) {
            setError(err.message || "Erro desconhecido ao buscar produtos.");
            console.error(err);
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
                                name: clientName,
                                service: serviceDescription,
                                time: timeString
                            })}
                        >
                            {clientName}
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

    useEffect(() => {
        fetchData();
        fetchStockItems();
    }, []);

    const ClientModal = ({ isOpen, client, onClose }) => {
        const [rightSideItems, setRightSideItems] = useState([]);
        const [productItemsInSchedule, setProductItemsInSchedule] = useState(client?.items || []);

        

        useEffect(() => {
            if (client) {
                setProductItemsInSchedule(client.items || []);
                console.log('Produtos no agendamento:', client.items || []);
            }
        }, [client]);

        const addQtdProduct = (name) => {
            // Encontrar o produto que foi selecionado
            const itemToAdd = stockItems.find(item => item.name === name);
            if (itemToAdd) {
                addProductToSchedule(client.id, itemToAdd);
        
                setRightSideItems(prevRightItems => {
                    const existingItem = prevRightItems.find(cartItem => cartItem.name === name);
                    if (existingItem) {
                        return prevRightItems.map(cartItem =>
                            cartItem.name === name ? { ...cartItem, amount: cartItem.amount + 1 } : cartItem
                        );
                    } else {
                        return [...prevRightItems, { ...itemToAdd, amount: 1 }];
                    }
                });
            }
        };
        

        const addProductToSchedule = async (clientId, product) => {
            try {
                if (!clientId || !product.id) {
                    throw new Error("Client ID ou Product ID inválido.");
                }
        
                console.log("Client ID:", clientId);
                console.log("Product ID:", product.id);
                console.log("Product Name:", product.name);
        
                const user = sessionStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;
                const token = parsedUser?.token;
        
                if (!token) {
                    setError("Erro de autenticação. Faça login novamente.");
                    return;
                }
        
                // Fazendo a requisição PUT para adicionar o produto ao agendamento
                const response = await fetch('http://localhost:8081/schedules/add-products', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: clientId, // ID do cliente
                        products: [
                            {
                                id: product.id, // ID do produto
                                productName: product.name,
                                amount: 1, // Adicionando 1 produto por vez
                                price: product.price,
                            }
                        ]
                    }),
                });
        
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}. Resposta do servidor: ${errorText}`);
                }
        
                const result = await response.json();
                console.log("Produto adicionado com sucesso:", result);
        
                // Atualizar a lista de produtos do agendamento
                setProductItemsInSchedule(prevItems => [
                    ...prevItems,
                    `${product.name} - R$ ${product.price.toFixed(2)}`
                ]);
        
                // Atualizar o estoque
                setStockItems(prevStockItems =>
                    prevStockItems.map(item =>
                        item.name === product.name ? { ...item, amount: item.amount - 1 } : item
                    )
                );
        
            } catch (err) {
                setError(err.message || "Erro desconhecido.");
                console.error("Erro ao adicionar produto:", err);
            }
        };
        
        const removeQtdProduct = (name) => {
            const itemToRemove = rightSideItems.find(item => item.name === name);

            if (itemToRemove) {
                setRightSideItems(prevRightItems =>
                    prevRightItems
                        .map(item =>
                            item.name === name && item.amount > 0 ? { ...item, amount: item.amount - 1 } : item
                        )
                        .filter(item => item.amount > 0)
                );

                setStockItems(prevLeftItems =>
                    prevLeftItems.map(item =>
                        item.name === name ? { ...item, amount: item.amount + 1 } : item
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
                    <p>Nome: {client.name}</p>
                    <p>Serviço: {client.service}</p>
                    <p>Horário: {client.time}</p>
                    <div className={styles.leftSide}>
                        <h3>Produtos do estoque</h3>
                        {stockItems.length === 0 ? (
                            <p>Não há produtos disponíveis.</p>
                        ) : (
                            stockItems.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <p>{item.name}</p>
                                    <p>R$ {item.price.toFixed(2)}</p>
                                    <p>QTD: {item.amount}</p>
                                    <button onClick={() => addQtdProduct(item.name)}>Adicionar</button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={styles.rightSide}>
                        <h3>Produtos do agendamento</h3>
                        {productItemsInSchedule.length === 0 ? (
                            <p>Não há produtos neste agendamento.</p>
                        ) : (
                            productItemsInSchedule.map((item, index) => (
                                <div key={index} className={styles.item}>
                                    <p>{item}</p>
                                </div>
                            ))
                        )}
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
