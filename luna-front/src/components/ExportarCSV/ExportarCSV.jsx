import React from 'react';
import styles from './ExportarCSV.module.css'; 

const ExportarCSV = ({ token }) => {
  const exportCSV = async () => {
    try {
      const response = await fetch('http://localhost:8081/finance/download', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao baixar o CSV');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'agendamentos.csv'; 
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  return (
    <button className={styles.buttonExportarCSV} onClick={exportCSV}>
      EXPORTAR CSV
    </button>
  );
};

export default ExportarCSV;
