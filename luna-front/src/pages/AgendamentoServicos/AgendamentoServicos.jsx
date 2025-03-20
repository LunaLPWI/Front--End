import '../../global.css';
import Header from '../../components/Header/Header';
import styles from './AgendamentoServicos.module.css';
import SelecaoPlanos from '../../components/SelecaodePlanos/SelecaoPlanos';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';

function AgendamentoServicos() {
  
    const { user } = useUser();
    const navigate = useNavigate();
  
  const links = [
    { name: 'PLANOS', path: '/planos' },
    { name: 'PERFIL', path: '/perfil' },
    { name: 'AGENDAR', path: '/agendamentos' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
  ];

  const handleAgendarClick = () => {
   sessionStorage.clear();
        navigate('/login');
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
          <Selecagit reflogoPlanos />
          
        </div>
      </div>
    </div>
  );
}

export default AgendamentoServicos;
