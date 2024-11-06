import React, { useState } from 'react';
import '../../global.css';
import styles from './Selection.module.css';

function Selection() {
  const [dropdownOpen, setDropdownOpen] = useState(Array(4).fill(false));
  const [addedServices, setAddedServices] = useState([]);

  const options = [
    [
      { value: 'cabelo_curto', label: 'Cabelo Curto', tempo: '30 minutos', valor: 40.00, descricao: 'Corte de cabelo curto' },
      { value: 'cabelo_longo', label: 'Cabelo Longo', tempo: '50 minutos', valor: 60.00, descricao: 'Corte de cabelo longo' },
    ],
    [
      { value: 'barba_simples', label: 'Barba Simples', tempo: '20 minutos', valor: 25.00, descricao: 'Aparar a barba simples' },
      { value: 'barba_modelada', label: 'Barba Modelada', tempo: '30 minutos', valor: 35.00, descricao: 'Modelar a barba' },
    ],
    [
      { value: 'sobrancelha_alta', label: 'Sobrancelha Alta', tempo: '15 minutos', valor: 20.00, descricao: 'Design de sobrancelha alta' },
      { value: 'sobrancelha_media', label: 'Sobrancelha Média', tempo: '20 minutos', valor: 25.00, descricao: 'Design de sobrancelha média' },
    ],
    [
      { value: 'limpeza_de_pele', label: 'Limpeza de Pele', tempo: '45 minutos', valor: 50.00, descricao: 'Limpeza facial completa' },
      { value: 'hidratação_facial', label: 'Hidratação Facial', tempo: '30 minutos', valor: 40.00, descricao: 'Hidratação profunda para o rosto' },
    ],
  ];

  const placeholders = [
    'Selecionar Cabelo',
    'Selecionar Barba e Bigode',
    'Selecionar Sobrancelha',
    'Selecionar Estética Facial',
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
    </div>
  );
}

export default Selection;
