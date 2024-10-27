import '../../global.css';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

import styles from '../Home/Home.module.css';

import cadeiraSobre from './../../assets/cadeira-sobre.jpg';
import horarioImg from './../../assets/horario-salao.png';
import cabeloService from './../../assets/cabeloServiceHome.png';
import barbaService from './../../assets/barbaServiceHome.png';
import cabeloEbarbaService from './../../assets/cabeloEbarbaServiceHome.png';

function Home() {
  const links = [
    { name: 'SOBRE NÓS', path: '#sobre-nos' }, 
    { name: 'SERVIÇOS', path: '#servicos' },   
    { name: 'FUNCIONAMENTO', path: '#funcionamento' }, 
    { name: 'ENTRAR', path: '/login' } 
  ];


  const handleAgendarClick = () => {
    alert('Botão Agendar clicado!');
  };

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <div className={styles.home}>
      <Header
        links={links}
        showButton={false}
        buttonText="SAIR"
        onButtonClick={handleAgendarClick} 
      />

      <section className={styles.heroSection}>
        <div className={styles.heroPosition}>
          <strong>O seu estilo encontra a <span style={{ color: "var(--red)" }}>tradição</span> que faz história!</strong>
          <a onClick={handleLoginClick} 
          href='/login'>AGENDAR</a>
        </div>
      </section>

      <section className={styles.aboutSection} id="sobre-nos">
        <div>
          <img className={styles.imgAbout} src={cadeiraSobre} alt="cadeira onde o cliente senta" />
        </div>
        <div className={styles.textAbout}>
          <h2>Sobre nós</h2>
          <p>
            A Dom Roque surgiu em 2010 com o sonho de criar um espaço que une tradição e modernidade no cuidado masculino, oferecendo uma experiência personalizada e de alta qualidade. Hoje, continuamos a evoluir, mantendo o compromisso com a excelência que nos definiu desde o início.
          </p>
          <h3>Por que nos escolher</h3>
          <p>
            Oferecemos mais que um simples serviço, oferecemos uma experiência única a cada serviço.
          </p>
        </div>
      </section>

      <section className={styles.hourSection} id="funcionamento">
        <div className={styles.containerHour}>
          <img src={horarioImg} alt="Horário de funcionamento do salão" />
          <div className={styles.textHour}>
            <h2>Horários de funcionamento</h2>
            <p>ter. a sex. das 09 às 20h / sab. das 09 às 17h</p>
          </div>
        </div>
      </section>

      <section className={styles.serviceSection}id="servicos" >
        <div className={styles.cardService}>
          <Card
            imageSrc={cabeloService}
            altText="Imagem de exemplo"
            title="Cabelo"
            onClick={handleLoginClick}
          />
          <Card
            imageSrc={barbaService}
            altText="Imagem de exemplo"
            title="Barba"
            onClick={handleLoginClick}
          />
          <Card
            imageSrc={cabeloEbarbaService}
            altText="Imagem de exemplo"
            title="Cabelo e Barba"
            onClick={handleLoginClick}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
