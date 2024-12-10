import { useState, useEffect } from 'react';
import styles from './Planos.module.css';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { DescricaoPlano } from '../../components/DescricaoPlano/DescricaoPlano';
import cabeloEbarbaService from './../../assets/cabeloEbarbaServiceHome.png';
import { useUser } from '../../context/userContext';
import { api } from '../../api'


function Planos() {
  const links = [
    { name: 'PLANOS', path: '/planos' },
    { name: 'PERFIL', path: '/perfil' },
    { name: 'AGENDAR', path: '/agendamentos' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' },
  ];

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const [selectedPlanoId, setSelectedPlanoId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCardClick = (id) => {
    setIsTransitioning(true); // 
    setTimeout(() => {
      setSelectedPlanoId(id);
      setIsTransitioning(false);
    }, 500);
  };

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPlanoId(null);
      setIsTransitioning(false);
    }, 500);
  };

  const [signature, setSignature] = useState([]);
  const { user } = useUser();

  const handleSignature = () => {
    api.post(`plans/create-plan-and-charge?cpf=${user.cpf}`, signature)
      .then((response) => {
        if (response.status === 201) {
          const { paymentUrl } = response.data;
          navigate(paymentUrl); 
        }
      })
      .catch((e) => {
        console.error('Erro ao criar o plano ', e);
      });
  };

  const planos = [
    { id: 1, title: 'Cabelo ou barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '130,00', imageSrc: cabeloEbarbaService, key: 'CABELO_OU_BARBA' },
    { id: 2, title: 'Cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '200,00', imageSrc: cabeloEbarbaService, key: 'CORTE_CABELO_E_BARBA' },
    { id: 3, title: 'Raspar a cabeça', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '100,00', imageSrc: cabeloEbarbaService, key: 'RASPAR_CABECA' },
    { id: 4, title: 'Raspar a cabeça + barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '180,00', imageSrc: cabeloEbarbaService, key: 'RASPAR_CABECA_E_BARBA' },
    { id: 5, title: 'Corte de cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 2 cortes de cabelo + 2 barbas', preco: '130,00', imageSrc: cabeloEbarbaService, key: 'CORTE_CABELO_E_BARBA_2' },
  ];

  const selectPlan = (planKey) => {
    const selectedPlan = planos.find((plano) => plano.key === planKey);
  
    if (!selectedPlan) {
      console.error('Plano não encontrado!');
      return;
    }
  
    setSignature({
      id: null, // ou qualquer valor necessário
      subscription_id: null, // ou algum valor pré-definido
      total: parseFloat(selectedPlan.preco.replace(',', '.')), // Convertendo '130,00' para número
      chargeRequest: planKey,
      payment: 'CREDIT_CARD', // exemplo
      first_execution: new Date().toISOString(), // exemplo
      plan: selectedPlan.title, // Atribuindo o título do plano como referência
      status: 'PENDING', // exemplo
      idClient: user.id, // certifique-se de que existe o `id` no objeto `user`
    });
  };
  




  return (
    <div className={styles['container-planos']}>
      <Header
        links={links}
        showButton={true}
        buttonText="SAIR"
        onButtonClick={handleLogoutClick}
      />
      <main>
        <section>
          {planos.map((plano) => (
            <div key={plano.id}>
              {selectedPlanoId === plano.id ? (
                <DescricaoPlano
                  className={isTransitioning ? styles['fade-out'] : styles['fade-in']}
                  plano={plano.title}
                  texto={plano.descricao}
                  preco={plano.preco}
                  botao="ASSINAR"
                  onSetinhaClick={handleBackClick}
                  onBotaoClick={() => {
                    selectPlan(plano.key);
                    handleSignature();
                  }}
                />
              ) : (
                <Card
                  className={
                    selectedPlanoId === null || selectedPlanoId === plano.id
                      ? isTransitioning
                        ? styles['fade-out']
                        : styles['fade-in']
                      : ''
                  }
                  imageSrc={plano.imageSrc}
                  altText="Imagem de exemplo"
                  title={plano.title}
                  texto="DESCRIÇÃO"
                  onClick={() => handleCardClick(plano.id)}
                />
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Planos;
