import { Link } from 'react-router-dom';
import '../../global.css';
import styles from './SelecaoPlanos.module.css';
import Selection from '../Selection/Selection';

function Selecaoplanos() {
  return (
    <div className={styles.container}>
      <div className={styles.containerPlanos}>
        <div className={styles.planoAtual}>Seu plano atual é: XXXXX</div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          Mudar de plano?
        </h1>
        <Link to="/planos" className={`${styles.planoAtual} ${styles.saibaMais}`}>
          Saiba mais
        </Link>
      </div>

      <div className={styles.containerPlanos}>
        <h1 style={{ color: 'white' }}>Serviços populares</h1>
        <Link to="/agendamentos" className={styles.button}>
          Avançar
        </Link>
      </div>

      <Selection />
    </div>
  );
}

export default Selecaoplanos;
