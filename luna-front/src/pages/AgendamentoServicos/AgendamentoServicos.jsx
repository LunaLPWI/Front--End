import '../../global.css'; // Isso deve funcionar se você está no diretório AgendamentoServicos
import Header from '../../components/Header/Header';
import '../../pages/AgendamentoServicos/Agenda.css';
import SelecaoPlanos from '../../components/selecaodeplanos/Selecaoplanos';

function AgendamentoServicos() {
  return (
    <div>
      <Header/>
      <div className="background-image">
        
        <SelecaoPlanos/>
        </div> 
      
    </div>
  );
}

export default AgendamentoServicos;