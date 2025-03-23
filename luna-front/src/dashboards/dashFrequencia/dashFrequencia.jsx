import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashFrequencia.module.css';

function DashFrequencia() {
    const [series, setSeries] = useState([0, 0, 0]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = sessionStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            const token = parsedUser && parsedUser.token ? parsedUser.token : null;
    
            if (!token) {
                console.error('Token não encontrado ou inválido.');
                setError('Erro de autenticação. Faça login novamente.');
                setIsLoading(false);
                return;
            }
    
            try {
                const response = await fetch('http://localhost:8080/finance/revenue/frequence', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Dados recebidos da API:', data); // <-- Verifica o que a API está retornando
    
                // Verifica se os valores recebidos são válidos
                const frequent = isNaN(parseFloat(data.frequentes)) ? 0 : parseFloat(data.frequentes);
                const medium = isNaN(parseFloat(data.medios)) ? 0 : parseFloat(data.medios);
                const occasional = isNaN(parseFloat(data.ocasionais)) ? 0 : parseFloat(data.ocasionais);
    
                console.log('Valores processados:', { frequent, medium, occasional }); // <-- Confirma os valores processados
    
                setSeries([frequent, medium, occasional]);
            } catch (error) {
                console.error('Erro na requisição:', error.message);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    const options = {
        chart: {
            type: 'pie',
            width: '100%',
        },
        labels: ['Frequentes', 'Médio', 'Ocasional'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        legend: {
            show: true,
        },
    };

    return (
        <div className={styles.dashFrequencia}>
            <div className={styles.dashContent}>
                <h2 className={styles.dashTitle}>Frequência</h2>
                <div className={styles.chartWrapper}>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <p className={styles.errorMessage}>Erro: {error}</p>
                    ) : Array.isArray(series) && series.every(value => typeof value === 'number') ? (
                        <Chart options={options} series={series} type="pie" />
                    ) : (
                        <p>Erro nos dados do gráfico.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashFrequencia;
