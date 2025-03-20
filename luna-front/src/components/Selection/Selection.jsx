import React, { useState } from 'react';
import '../../global.css';
import styles from './Selection.module.css';

const tasks = [
  { value: 'CORTE', label: 'Corte de cabelo', tempo: 30, valor: 50.0 },
  { value: 'BARBA', label: 'Aparar barba', tempo: 30, valor: 40.0 },
  { value: 'BOTOX', label: 'Botox', tempo: 30, valor: 65.0 },
  { value: 'HIDRATACAO', label: 'Hidratação no cabelo', tempo: 30, valor: 40.0 },
  { value: 'PEZINHOCABELOBARBA', label: 'Pezinho cabelo e barba', tempo: 30, valor: 30.0 },
  { value: 'PEZINHO', label: 'Pezinho do cabelo', tempo: 30, valor: 15.0 },
  { value: 'PLATINADOCORTE', label: 'Platinar e cortar o cabelo', tempo: 30, valor: 120.0 },
  { value: 'RASPARCABECA', label: 'Raspar a cabeça', tempo: 30, valor: 27.0 },
  { value: 'SOBRANCELHA', label: 'Fazer a sobrancelha', tempo: 30, valor: 20.0 },
  { value: 'RELAXAMENTO', label: 'Relaxamento no cabelo', tempo: 30, valor: 20.0 },
];

function Selection() {
  const [addedServices, setAddedServices] = useState(() => {
    const savedServices = Object.keys(sessionStorage).map((key) => {
      try {
        const item = JSON.parse(sessionStorage.getItem(key));
        if (item && item.nome && item.valor && item.tempo) {
          return { ...item, value: key }; 
        }
      } catch {
        console.warn(`Invalid item in sessionStorage: ${key}`);
      }
      return null;
    });
    return savedServices.filter(Boolean) || []; 
  });

  const handleAddService = (task) => {
    if (addedServices.some((service) => service.value === task.value)) {
      return; 
    }
    
    const newService = {
      nome: task.label,
      label: task.label,
      valor: task.valor,
      tempo: task.tempo,
    };

    sessionStorage.setItem(task.value, JSON.stringify(newService));

    setAddedServices((prevServices) => [...prevServices, { ...newService, value: task.value }]);
  };

  const handleRemoveService = (value) => {
    const updatedServices = addedServices.filter((service) => service.value !== value);

    sessionStorage.removeItem(value);

    setAddedServices(updatedServices);
  };


  const handleAdvance = () => {
    onSaveServices(addedServices);
  };

  return (
    <div className={styles.containerRow}>
      <div className={styles.containerSelect}>
        <div className={styles.dropdownMenu}>
          {tasks.map((task) => (
            <div key={task.value} className={styles.dropdownItem}>
              <span>{task.label}</span>
              <div className={styles.details}>
                <p className={styles.detailTime}>Tempo estimado: {task.tempo} minutos</p>
                <p className={styles.detailValue}>Valor: R$ {task.valor.toFixed(2)}</p>
                <button
                  className={styles.addButton}
                  onClick={() => handleAddService(task)}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.listServices}>
        <h2>Serviços Selecionados</h2>
        <ul>
          {addedServices.length > 0 ? (
            addedServices.map((service, index) => (
              <li key={index}>
                {service.label} - R$ {service.valor.toFixed(2)}
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveService(service.value)}
                >
                  Remover
                </button>
              </li>
            ))
          ) : (
            <li>Nenhum serviço adicionado</li>
          )}
        </ul>
      </div>

      {/* Botão "Avançar" chama a função handleAdvance */}
      <div className={styles.button} onClick={handleAdvance}>Avançar</div>
    </div>
  );
}

export default Selection;
