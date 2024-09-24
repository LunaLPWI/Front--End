import '../../global.css';
import '../../components/selecaodeplanos/selecaoPlanos.css';

function Selecaoplanos() {
  return (
    <div>
      <div className="container">

        <div className="container-planos">
          <div className="planoAtual">Seu plano atua é: XXXXX</div>
          <h1 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Mudar de plano ? </h1>
          <div className="planoAtual">Seu plano atua é: XXXXX</div>
        </div>



      </div>
    </div>
  );
}

export default Selecaoplanos;
