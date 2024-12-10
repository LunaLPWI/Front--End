import React from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashColaborador.module.css';

function DashColaborador() {
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
            formatter: (val) => {
                return val / 1000 + 'K';
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: [
                'DERICK',
                'MARCIO'
            ],
        },
        fill: {
            opacity: 1,
        },
        colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
        yaxis: {
            labels: {
                formatter: (val) => {
                    return val / 1000 + 'K';
                },
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
    };

    const series = [
        {
            name: 'DERICK',
            group: 'actual',
            data: [48000, 50000],
        },
        {
            name: 'MARCIO',
            group: 'actual',
            data: [20000, 40000],
        },
    ];

    return (
        <div className={styles.dashColaborador}>
            <h2 className={styles.dashTitle}>Colaborador em Destaque dos Ultimos 30 dias</h2>
            <Chart options={options} series={series} type="bar" height={290} />
        </div>
    );
}

export default DashColaborador;
