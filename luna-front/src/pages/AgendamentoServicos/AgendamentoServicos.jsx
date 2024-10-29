import '../../global.css';
import Header from '../../components/Header/Header';
import styles from './AgendamentoServicos.module.css';
import SelecaoPlanos from '../../components/SelecaodePlanos/SelecaoPlanos';
import React, { useState } from 'react';
import { useUser } from '../../context/userContext';

function AgendamentoServicos() {
  
    const { user } = useUser();
  
  const links = [
    { name: 'PLANOS', path: '/planos' },
    { name: 'PERFIL', path: '/perfil' },
    { name: 'AGENDAR', path: '/agendar' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
  ];

  const handleAgendarClick = () => {
    alert('Botão Agendar clicado!');
  };


  return (
    <div>
      <Header
        links={links}
        showButton={true}
        buttonText="SAIR"
        onButtonClick={handleAgendarClick}
      />
      <div className={styles.backgroundImage}>
        <div className={styles.containerSelects}>
          <SelecaoPlanos />
          
        </div>
      </div>
    </div>
  );
}

export default AgendamentoServicos;
