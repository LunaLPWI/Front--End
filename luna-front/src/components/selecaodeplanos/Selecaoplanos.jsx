import { Link } from 'react-router-dom';
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
