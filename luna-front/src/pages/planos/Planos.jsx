import '../../global.css';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';

function Planos () {

  const navigate = useNavigate();
  const links = [
    { name: 'PLANOS', path: '/planos' },
    { name: 'PERFIL', path: '/perfil' },
    { name: 'AGENDAR', path: '/agendamentos' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
  ];


  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Header
        links={links}
        showButton={true}
        buttonText="SAIR"
        onButtonClick={handleLogoutClick}
      />
      <h1>Plano!!!!!!!!</h1>
    </div>
  );
}

export default Planos;