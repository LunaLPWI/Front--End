import '../../global.css'; // Isso deve funcionar se você está no diretório AgendamentoServicos
import Header from '../../components/Header/Header';
import FormularioPagamento from '../../components/formularioPagamento/FormularioPagamento';

function Home() {
  return (
    <div>
      <Header/>
      <h1>home!!!!!!!!</h1>
      <FormularioPagamento/>
    </div>
  );
}

export default Home;