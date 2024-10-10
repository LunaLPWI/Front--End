import '../../global.css';
import Header from '../../components/Header/Header';
import Calendario from '../../components/Calendario/Calendario';

import styles from '../Agendamento/Agendamento.module.css';

function Agendamento() {
    const links = [
        { name: 'PLANOS', path: '/planos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'AGENDAR', path: '/agendar' },
        { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
    ];


    const handleAgendarClick = () => {
        alert('Botão Agendar clicado!');
    };

    return (
        <>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleAgendarClick}
            />
            <section className={styles.agenda}>

                <div className={styles.containerAgenda}>
                    <div className={styles.agendaDate}>
                        <Calendario/>
                    </div>
                    <div className={styles.service}>
                        <h2>Serviços Selecionados</h2>
                        <hr className={styles.hrAgenda} />
                        <div className={styles.serviceSelected}>
                            <p>cabelo</p>
                            <p>barba</p>
                        </div>
                        <hr className={styles.hrAgenda} />
                        <button>Finalizar</button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Agendamento;