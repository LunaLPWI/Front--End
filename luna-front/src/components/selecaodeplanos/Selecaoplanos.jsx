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
        <div className="container-planos">
          <h1>Serviçoes populares</h1>
          <div className="planoAtual">Seu plano atua é: XXXXX</div>
        </div>
        <select class="select_dropdown">
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
          <option value="3">Opção 3</option>
        </select>
        <select class="select_dropdown">
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
          <option value="3">Opção 3</option>
        </select>
        <select class="select_dropdown">
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
          <option value="3">Opção 3</option>
        </select>
        <select class="select_dropdown">
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
          <option value="3">Opção 3</option>
        </select>
      </div>
    </div>
  );
}

export default Selecaoplanos;
