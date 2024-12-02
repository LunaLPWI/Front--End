import React, { useEffect, useState } from 'react';
import styles from './SelectedServices.module.css';

function SelectedServices() {
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const services = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const service = JSON.parse(sessionStorage.getItem(key));
      if (service && service.nome && service.valor) {
        services.push({ key, ...service });
      }
    }
    setSelectedServices(services);
  }, []);

  const handleRemoveService = (key) => {
    sessionStorage.removeItem(key);
    setSelectedServices(prevServices => prevServices.filter(service => service.key !== key));
  };

  return (
    <div className={styles.service}>
      <h2>Serviços Selecionados</h2>
      <hr className={styles.hrAgenda} />
      <div className={styles.serviceSelected}>
        {selectedServices.length > 0 ? (
          selectedServices.map(service => (
            <div key={service.key} className={styles.serviceItem}>
              <p>{service.nome}</p>
              <p>R$ {service.valor.toFixed(2)}</p>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveService(service.key)}
              >
                Remover
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum serviço selecionado</p>
        )}
      </div>
      <hr className={styles.hrAgenda} />
    </div>
  );
}

export default SelectedServices;
