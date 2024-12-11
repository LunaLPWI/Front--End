import React, { useEffect, useState } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import styles from './GerenciamentoCliente.module.css';

function GerenciamentoCliente() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const links = [
        { name: 'DASHBOARD', path: '/financeiro' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'AGENDAS', path: '/agenda-clientes' },
        { name: 'ESTOQUE', path: '/estoque' }
    ];

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const headers = ['Nome completo', 'Plano', 'Vencimento do plano', 'Status', 'Celular'];

    const capitalizeName = (name) => {
        if (!name) return name;
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return phoneNumber;

        const cleaned = phoneNumber.replace(/\D/g, '');

        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;  
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const fetchData = async () => {
        try {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser ? parsedUser.token : null;

            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const response = await fetch('http://localhost:8080/clients/clients-overview', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Status da Resposta:', response.status);  
            console.log('Tipo de Conteúdo:', response.headers.get('content-type')); 

            const text = await response.text(); 
            console.log('Resposta recebida:', text);

            let result;
            try {
                result = JSON.parse(text); 
            } catch (error) {
                throw new Error(`Erro ao parsear a resposta como JSON: ${error.message}`);
            }

            console.log('Resultado JSON:', result);
            if (Array.isArray(result)) {
                processResponse(result); 
            } else {
                console.error('Resposta inesperada da API:', result);  // Adiciona log detalhado da resposta inesperada
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
        const transformedData = result.map(client => [
            capitalizeName(client.name),
            client.planName || 'N/A',
            formatDate(client.expireAt),  // Formatação correta da data
            client.status || 'N/A',
            formatPhoneNumber(client.phoneNumber),  
        ]);
        setData(transformedData);
    };

    useEffect(() => {
        console.log('useEffect chamado');
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
            <section className={styles.management}>
                <div className={styles.containerManagement}>
                    <h1>GERENCIAMENTO DOS CLIENTES - VISÃO GERAL</h1>
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

export default GerenciamentoCliente;
