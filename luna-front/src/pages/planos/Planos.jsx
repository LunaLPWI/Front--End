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
    { name: 'SERVIÇOS', path: '/serviços' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' },
  ];

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const [selectedPlanoId, setSelectedPlanoId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCardClick = (id) => {
    setIsTransitioning(true);
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

  const planos = [
    { id: 1, title: 'Cabelo ou barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '130,00', imageSrc: cabeloEbarbaService, key: 'CORTE_OU_BARBA' },
    { id: 2, title: 'Cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '200,00', imageSrc: cabeloEbarbaService, key: 'CORTE_CABELO_E_BARBA' },
    { id: 3, title: 'Raspar a cabeça', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '100,00', imageSrc: cabeloEbarbaService, key: 'RASPAR_CABECA' },
    { id: 4, title: 'Raspar a cabeça + barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '180,00', imageSrc: cabeloEbarbaService, key: 'RASPAR_CABECA_E_BARBA' },
    { id: 5, title: 'Corte de cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 2 cortes de cabelo + 2 barbas', preco: '130,00', imageSrc: cabeloEbarbaService, key: 'CORTE_CABELO_E_BARBA_2' },
  ];

  const { user } = useUser();

  const selectPlan = (planKey) => {
    if (loading) return; 
    setLoading(true); 

    const selectedPlan = planos.find((plano) => plano.key === planKey);

    if (!selectedPlan) {
      console.error('Plano não encontrado!');
      setLoading(false); 
      return;
    }

    const planData = {
      planName: planKey,
      status: "active"
    };

    handleSignature(planData);
  };

  const handleSignature = (planData) => {
    console.log('Payload enviado:', planData);
    const cpfString = String(user.cpf);
    api.post(`plans/create-plan-and-charge?cpf=${cpfString}`, planData)
      .then((response) => {
        setLoading(false);
        if (response.status === 201) {
          const { payment_url } = response.data; 
          if (payment_url) {
            window.open(payment_url, '_blank');
          } else {
            console.error('URL de pagamento não encontrada na resposta:', response.data);
          }
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error('Erro ao criar o plano:', e);
        console.log('Resposta completa do erro:', e.response?.data);
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
                  botao={loading ? "Carregando..." : "ASSINAR"} 
                  onSetinhaClick={handleBackClick}
                  onBotaoClick={() => {
                    selectPlan(plano.key);
                  }}
                />
              ) : (
                <Card
                  className={selectedPlanoId === null || selectedPlanoId === plano.id ? isTransitioning ? styles['fade-out'] : styles['fade-in'] : ''}
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
