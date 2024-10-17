import '../../global.css';
import styles from './SelecaoPlanos.module.css';
import Selection from '../Selection/Selection'
function Selecaoplanos() {
  return (
    <div className={styles.container}>

      <div className={styles.containerPlanos}>
        <div className={styles.planoAtual}>Seu plano atual é: XXXXX</div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          Mudar de plano?
        </h1>
        <div to="/"  className={`${styles.planoAtual} ${styles.saibaMais}`}>Saiba mais</div>
      </div>


      <div className={styles.containerPlanos}>
        <h1 style={{ color: 'white' }}>Serviços populares</h1>
        <div to="/" className={styles.button}>Avançar</div>
      </div>

      <Selection/>
    </div>
  );
}

export default Selecaoplanos;
