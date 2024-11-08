import { useState } from 'react';
import styles from './Planos.module.css';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { DescricaoPlano } from '../../components/DescricaoPlano/DescricaoPlano';
import cabeloEbarbaService from './../../assets/cabeloEbarbaServiceHome.png';

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

  const handleSignature = () =>{
    navigate('/')
  }

  const planos = [
    { id: 1, title: 'Cabelo ou barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '130,00', imageSrc: cabeloEbarbaService },
    { id: 2, title: 'Cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '200,00', imageSrc: cabeloEbarbaService },
    { id: 3, title: 'Raspar a cabeça', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 1 por semana', preco: '100,00', imageSrc: cabeloEbarbaService },
    { id: 4, title: 'Raspar a cabeça + barba', descricao: '<b>O que esse plano oferece</b>: <br> 4 serviços, sendo 1 por semana', preco: '180,00', imageSrc: cabeloEbarbaService },
    { id: 5, title: 'Corte de cabelo + barba', descricao: '<b>O que esse plano oferece:</b> <br> 4 serviços, sendo 2 cortes de cabelo + 2 barbas', preco: '130,00', imageSrc: cabeloEbarbaService },
  ];

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
                  onBotaoClick={handleSignature}
                />
              ) : (
                <Card
                  className={selectedPlanoId === null || selectedPlanoId === plano.id
                    ? isTransitioning ? styles['fade-out'] : styles['fade-in']
                    : ''}
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
