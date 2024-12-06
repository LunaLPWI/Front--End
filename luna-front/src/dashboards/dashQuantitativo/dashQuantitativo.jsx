import React from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashQuantitativo.module.css';

function DashQuantitativo() {
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
      type: 'datetime',
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };
  const series = [
    {
      name: 'Serviços',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Planos',
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];


  return (
    <div className={styles.dashQuantitativo}>
      <h2 className={styles.dashTitle}>Gráfico Quantitativo</h2>
      <Chart options={options} series={series} type="area" height={290} />
    </div>
  );
}

export default DashQuantitativo;
