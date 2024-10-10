import '../../global.css'; // Isso deve funcionar se você está no diretório AgendamentoServicos
import Header from '../../components/Header/Header';
import '../../pages/AgendamentoServicos/Agenda.css';
import SelecaoPlanos from '../../components/selecaodeplanos/Selecaoplanos';

function AgendamentoServicos() {
  return (
    <div>
      <Header />
      <div className="background-image" style={{

        display: 'flex'
      }}>
        <div className="containerSelects">
<SelecaoPlanos />
        <div className="backImage"></div>
        </div>
        
      </div>

    </div>
  );
}

export default AgendamentoServicos;