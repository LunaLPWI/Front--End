import '../../global.css';
import styles from './SelecaoPlanos.module.css';
import Selection from '../Selection/Selection';

function Selecaoplanos() {

  // Função para salvar os serviços
  const handleSaveServices = () => {
    alert('Serviços foram salvos e você pode avançar!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerPlanos}>
        <div className={styles.planoAtual}>Seu plano atual é: XXXXX</div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          Mudar de plano?
        </h1>
        <div to="/" className={`${styles.planoAtual} ${styles.saibaMais}`}>Saiba mais</div>
      </div>

      <div className={styles.containerPlanos}>
        <h1 style={{ color: 'white' }}>Serviços populares</h1>
        {/* Botão de avançar chama a função de salvar */}
        <div className={styles.button} onClick={handleSaveServices}>Avançar</div>
      </div>
      <Selection onSaveServices={handleSaveServices} />
    </div>
  );
}

export default Selecaoplanos;
