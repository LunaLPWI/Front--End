import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashColaborador.module.css';

function DashColaborador() {
  const [series, setSeries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDateRange = () => {
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
      const token = parsedUser?.token || null;

      if (!token) {
        console.error('Token não encontrado.');
        setError('Erro de autenticação. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      const { startDate, endDate } = getDateRange();
      const employeeIds = [1, 2]; // IDs dos colaboradores (MARCIO e DERICK)

      try {
        const fetchServiceData = async (employeeId) => {
          const response = await fetch(
            `http://localhost:8080/finance/quantity/services-employee?startDate=${startDate}&endDate=${endDate}&funcId=${employeeId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            throw new Error(`Erro ao buscar dados do funcionário ${employeeId}`);
          }

          return response.json();
        };

        const [marcioServices, derickServices] = await Promise.all([
          fetchServiceData(employeeIds[0]),
          fetchServiceData(employeeIds[1]),
        ]);

        console.log('Serviços - Marcio:', marcioServices);
        console.log('Serviços - Derick:', derickServices);

        setSeries([
          {
            name: 'Serviços',
            data: [marcioServices, derickServices],
          },
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
      type: 'bar',
      height: 350,
      stacked: true,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    dataLabels: {
      formatter: (val) => val.toFixed(0), 
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: ['MARCIO', 'DERICK'],
    },
    fill: {
      opacity: 1,
    },
    colors: ['#80c7fd', '#008FFB'], 
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(0), 
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  };

  if (isLoading) {
    return <div className={styles.dashColaborador}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.dashColaborador}>{error}</div>;
  }

  console.log('Dados para o gráfico:', series);

  return (
    <div className={styles.dashColaborador}>
      <h2 className={styles.dashTitle}>Colaborador em Destaque dos Últimos 30 dias</h2>
      <Chart options={options} series={series} type="bar" height={290} />
    </div>
  );
}

export default DashColaborador;
