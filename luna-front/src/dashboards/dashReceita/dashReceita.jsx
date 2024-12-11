import '../../global.css';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import styles from './dashReceita.module.css';

function DashReceita() {
  const [series, setSeries] = useState([
    { name: 'serviços', data: [] },
    { name: 'produtos', data: [] },
  ]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para calcular o intervalo de 12 meses
  const getYearRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);

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
        const [servicesResponse, productsResponse] = await Promise.all([
          fetch(
            `http://localhost:8081/finance/revenue/services?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(
            `http://localhost:8081/finance/revenue/products?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (!servicesResponse.ok || !productsResponse.ok) {
          console.error('Erro nas respostas do servidor.');
          throw new Error('Erro ao buscar dados do backend.');
        }

        const servicesData = await servicesResponse.json();
        const productsData = await productsResponse.json();

        if (servicesData.length !== 12 || productsData.length !== 12) {
          console.error('Erro: A resposta da API não contém 12 meses de dados.');
          throw new Error('A resposta da API não contém 12 meses de dados.');
        }

        setSeries([
          { name: 'serviços', data: servicesData },
          { name: 'produtos', data: productsData },
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
    series,
    chart: {
      type: 'bar',
      width: '100%',
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
      ],
    },
    yaxis: {
      title: {
        text: '$ (reais)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `$ ${val} reais`;
        },
      },
    },
  };

  if (isLoading) {
    return <div className={styles.dashReceita}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.dashReceita}>{error}</div>;
  }

  return (
    <div className={styles.dashReceita}>
      <h2 className={styles.dashTitle}>Receita Total</h2>
      <Chart options={options} series={series} type="bar" height={250} />
    </div>
  );
}

export default DashReceita;
