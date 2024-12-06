import '../../global.css';
import React from 'react';
import Chart from 'react-apexcharts';
import styles from './dashReceita.module.css';

function DashReceita() {
  const options = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 15],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 20, 94, 10],
      },

    ],
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
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  return (
    <div className={styles.dashReceita}>
      <h2 className={styles.dashTitle}>Receita Total</h2>
      <Chart options={options} series={options.series} type="bar" height={250} />
    </div>
  );
}

export default DashReceita;
