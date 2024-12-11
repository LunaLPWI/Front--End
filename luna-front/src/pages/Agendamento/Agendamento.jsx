import '../../global.css';
import Header from '../../components/Header/Header';
import SelectedServices from '../../components/SelectedServices/SelectedServices';
import Calendario from '../../components/Calendario/Calendario';
import { useNavigate } from 'react-router-dom';
import styles from '../Agendamento/Agendamento.module.css';
import { useUser } from '../../context/userContext';

function Agendamento() {
    const { user } = useUser();

    const links = [
        { name: 'PLANOS', path: '/planos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'SERVIÇOS', path: '/serviços' },
        { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' },
    ];

    const navigate = useNavigate()
    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleLogoutClick}
            />
            <section className={styles.agenda}>

                <div className={styles.containerAgenda}>
                    <div className={styles.agendaDate}>
                        <Calendario />
                    </div>
                    <div className={styles.service}>
                        <SelectedServices />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Agendamento;