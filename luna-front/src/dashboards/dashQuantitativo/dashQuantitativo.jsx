import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashQuantitativo.module.css';

function DashQuantitativo() {
  const [series, setSeries] = useState([
    { name: 'Serviços', data: [] },
    { name: 'Planos', data: [] },
  ]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para obter o intervalo de meses (janeiro a dezembro)
  const getYearRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1); // Janeiro
    const endDate = new Date(now.getFullYear(), 11, 31); // Dezembro

    const formatDate = (date) => date.toISOString().split('T')[0];
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

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

      const { startDate, endDate } = getYearRange();

      try {
        const [servicesResponse, plansResponse] = await Promise.all([
          fetch(
            `http://localhost:8081/finance/revenue/services?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `http://localhost:8081/finance/quantity/plans?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (!servicesResponse.ok || !plansResponse.ok) {
          console.error('Erro nas respostas do servidor.');
          throw new Error('Erro ao buscar dados do backend.');
        }

        const servicesData = await servicesResponse.json();
        const plansData = await plansResponse.json();

        console.log('Dados de serviços:', servicesData);
        console.log('Dados de planos:', plansData);

        if (servicesData.length !== 12 || plansData.length !== 12) {
          console.error('Erro: A resposta da API não contém 12 meses de dados.');
          throw new Error('A resposta da API não contém 12 meses de dados.');
        }

        setSeries([
          { name: 'Serviços', data: servicesData },
          { name: 'Planos', data: plansData },
        ]);
      } catch (err) {
        console.error('Erro na requisição:', err.message);
        setError('Erro ao carregar os dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
      ],
    },
    tooltip: {
      x: {
        format: 'MM/yyyy',
      },
    },
  };

  if (isLoading) {
    return <div className={styles.dashQuantitativo}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.dashQuantitativo}>{error}</div>;
  }

  return (
    <div className={styles.dashQuantitativo}>
      <h2 className={styles.dashTitle}>Quantidade Serviços & Planos</h2>
      <Chart options={options} series={series} type="area" height={290} />
    </div>
  );
}

export default DashQuantitativo;
