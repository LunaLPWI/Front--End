import React, { useState } from 'react';
import '../../global.css';
import styles from './Selection.module.css';

function Selection({ onSaveServices }) {
  const [dropdownOpen, setDropdownOpen] = useState(Array(7).fill(false)); // Corrigido para ter 7 dropdowns
  const [addedServices, setAddedServices] = useState([]);

  const options = [
    [
      { value: 'CORTE', label: 'CORTE', tempo: '30 minutos', valor: 50.00, descricao: 'Corte de cabelo' },
      { value: 'PEZINHO', label: 'PEZINHO', tempo: '30 minutos', valor: 15.00, descricao: 'Pezinho do cabelo' },
    ],
    [
      { value: 'BARBA', label: 'BARBA', tempo: '30 minutos', valor: 40.00, descricao: 'Aparar barba' },
      { value: 'PEZINHOCABELOBARBA', label: 'Pezinho cabelo e barba', tempo: '30 minutos', valor: 30.00, descricao: 'Pezinho cabelo e barba' },
    ],
    [
      { value: 'SOBRANCELHA', label: 'SOBRANCELHA', tempo: '20 minutos', valor: 20.00, descricao: 'Fazer a sobrancelha' },
    ],
    [
      { value: 'HIDRATACAO', label: 'HIDRATACAO', tempo: '30 minutos', valor: 40.00, descricao: 'Hidratação no cabelo' },
      { value: 'RELAXAMENTO', label: 'RELAXAMENTO', tempo: '30 minutos', valor: 20.00, descricao: 'Relaxamento no cabelo' },
    ],
    [
      { value: 'BOTOX', label: 'BOTOX', tempo: '60 minutos', valor: 65.00, descricao: 'Botox' },
    ],
    [
      { value: 'PLATINADOCORTE', label: 'PLATINADOCORTE', tempo: '180 minutos', valor: 120.00, descricao: 'Platinar e cortar o cabelo' },
    ],
    [
      { value: 'RASPARCABECA', label: 'RASPARCABECA', tempo: '30 minutos', valor: 27.00, descricao: 'Raspar a cabeça' },
    ]
  ];

  const placeholders = [
    'Selecionar Cabelo',           // 0
    'Selecionar Barba e Bigode',   // 1
    'Selecionar Sobrancelha',      // 2
    'Selecionar Estética Facial',  // 3
    'Selecionar Botox',            // 4
    'Selecionar Platinação',       // 5
    'Selecionar Raspar Cabeça'     // 6
  ];

  const handleAddService = (index, value) => {
    const selectedOption = options[index].find(opt => opt.value === value);
    if (selectedOption) {
      setAddedServices(prevServices => {
        const newServices = [...prevServices, selectedOption];
        const tempo = parseInt(selectedOption.tempo);
        sessionStorage.setItem(
          selectedOption.value,
          JSON.stringify({
            nome: selectedOption.label,
            valor: selectedOption.valor,
            tempo: tempo,
          })
        );

        return newServices;
      });
    }
  };

  const handleRemoveService = (index, value) => {
    setAddedServices(prevServices => {
      const newServices = prevServices.filter(service => service.value !== value);
      return newServices;
    });

    const remainingOptions = getFilteredOptions(index);
    if (remainingOptions.length === 0) {
      setDropdownOpen(prev => {
        const newDropdownOpen = [...prev];
        newDropdownOpen[index] = false;
        return newDropdownOpen;
      });
    }
  };

  const toggleDropdown = (index) => {
    const filteredOptions = getFilteredOptions(index);
    if (filteredOptions.length > 0) {
      setDropdownOpen(dropdownOpen.map((isOpen, i) => i === index ? !isOpen : false));
    }
  };

  const getFilteredOptions = (index) => {
    const selectedValues = addedServices.map(service => service.value);
    return options[index].filter(opt => !selectedValues.includes(opt.value));
  };


  const handleAdvance = () => {
    onSaveServices(addedServices);
  };

  return (
    <div className={styles.containerRow}>
      <div className={styles.containerSelect}>
        {options.map((_, index) => {
          const filteredOptions = getFilteredOptions(index);

          return (
            <div key={index} className={styles.selectWrapper}>
              <div
                className={styles.selectBox}
                onClick={() => toggleDropdown(index)}
              >
                <span>{placeholders[index]}</span>
                <span className={styles.arrow}>{dropdownOpen[index] ? '▲' : '▼'}</span>
              </div>
              {dropdownOpen[index] && (
                <div className={styles.dropdownMenu}>
                  {filteredOptions.map(({ value, label, tempo, valor, descricao }) => (
                    <div key={value} className={styles.dropdownItem}>
                      {label}
                      <div className={styles.details}>
                        <p className={styles.detailTime}>Tempo estimado: {tempo}</p>
                        <p className={styles.detailDescription}>{descricao}</p>
                        <p className={styles.detailValue}>Valor R$ {valor.toFixed(2)}</p>
                        <button
                          className={styles.addButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddService(index, value);
                          }}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.listServices}>
        <h2>Lista de Itens</h2>
        <ul>
          {addedServices.length > 0 ? (
            addedServices.map((service, index) => (
              <li key={index}>
                {service.label} - R$ {service.valor.toFixed(2)}
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveService(index, service.value)}
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
