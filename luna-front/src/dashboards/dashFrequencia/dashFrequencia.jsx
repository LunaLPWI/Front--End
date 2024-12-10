import React from 'react';
import Chart from 'react-apexcharts';
import '../../global.css';
import styles from './dashFrequencia.module.css';

function DashFrequencia() {
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
    };

    const series = [13.8, 28.7, 57.5];

    return (
        <div className={styles.dashFrequencia}>
            <div className={styles.dashContent}>
                <h2 className={styles.dashTitle}>Frequência</h2>
                <div className={styles.chartWrapper}>
                    <Chart options={options} series={series} type="pie" />
                </div>
            </div>
        </div>
    );
}

export default DashFrequencia;
