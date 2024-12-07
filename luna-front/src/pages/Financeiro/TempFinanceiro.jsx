import '../../global.css'
import Header from '../../components/Header/Header'
import DashFrequencia from '../../dashboards/dashFrequencia/dashFrequencia';
import DashReceita from '../../dashboards/dashReceita/dashReceita';
import DashColaborador from '../../dashboards/dashColaborador/dashColaborador';
import DashQuantitativo from '../../dashboards/dashQuantitativo/dashQuantitativo';
import { useNavigate } from 'react-router-dom';
import styles from '../Financeiro/Financeiro.module.css'

function Financeiro() {

    const links = [
        { name: 'PLANOS', path: '/planos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'AGENDAR', path: '/agendamentos' },
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
            <section className={styles.containerFinanceiro}>
                <div className={styles.dashboardWrapper}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <div className={styles.columnCardSmall}>
                                <div className={styles.cardSmall}>
                                    <h2>Clientes por Plano</h2>
                                </div>
                                <div className={styles.cardSmall}>
                                    <h2>Planos Cancelados</h2>
                                </div>
                                <div className={styles.cardSmall}>
                                    <h2>Alerta de Frequência</h2>
                                </div>
                            </div>
                            <div className={styles.cardWide}>
                                <DashReceita />
                            </div>
                        </div>
                        <div className={styles.cardTall}>
                            <DashFrequencia />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.cardExtraWide}>
                            <DashQuantitativo />
                        </div>
                        <div className={styles.cardMedium}>
                            <DashColaborador />
                        </div>
                    </div>
                </div>
            </section>

        </>
    )

}

export default Financeiro;