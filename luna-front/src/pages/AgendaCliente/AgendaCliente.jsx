import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';

import styles from './AgendaCliente.module.css'

function AgendaCliente() {
    const links = [
        { name: 'DASHBOARD', path: '/dashboard' },
        { name: 'CLIENTES', path: '#' },
        { name: 'AGENDAS', path: '/gerenciamento-clientes' },
        { name: 'ESTOQUE', path: '/estoque' }
    ];

    const handleAgendarClick = () => {
        alert('Botão Agendar clicado!');
    };
    const headers = ['Horário', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const data = [
        ['09:30h', 'Taylor Swift', '', '', 'Bruno Mars', ''],
        ['10:00h', '', 'Billie Eilish', 'Dua Lipa', '', 'Katy Perry'],
        ['10:30h', 'Shawn Mendes', '', '', 'Sia', ''],
        ['11:00h', '', 'Post Malone', 'Rihanna', '', 'Drake'],
        ['11:30h', 'Selena Gomez', '', '', '', 'The Weeknd'],
        ['12:00h', '', 'J Balvin', 'Doja Cat', '', 'Charlie Puth'],
        ['12:30h', '', '', 'Lil Nas X', '', 'Miley Cyrus'],
        ['13:00h', 'Camila Cabello', '', 'Sam Smith', '', ''],
        ['13:30h', '', 'Nick Jonas', '', 'Kesha', ''],
        ['14:00h', '', '', '', 'The Weeknd', ''],
        ['14:30h', 'Harry Styles', '', 'Halsey', '', ''],
        ['15:00h', '', 'Demi Lovato', '', '', 'Lady Gaga'],
        ['15:30h', '', '', 'Justin Bieber', '', ''],
        ['16:00h', 'Billie Eilish', '', '', 'Sia', ''],
        ['16:30h', '', 'Ariana Grande', '', 'Bruno Mars', ''],
        ['17:00h', '', '', 'Rihanna', '', 'Ed Sheeran'],
        ['17:30h', 'Katy Perry', '', '', '', 'Drake'],
        ['18:00h', '', 'Post Malone', 'Doja Cat', '', ''],
        ['18:30h', '', '', 'Lil Nas X', '', 'Charlie Puth'],
        ['19:00h', 'Selena Gomez', '', 'Camila Cabello', '', ''],
    ];
    

    return (
        <>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleAgendarClick}
            />
            <section className={styles.agendaCliente}>
                <div className={styles.containerAgendaCliente}>
                    <h1>AGENDA DOS CLIENTES</h1>
                    <DynamicTable headers={headers} data={data} useFilter={false} usePagination={true} />
                </div>
            </section>
        </>
    )
}

export default AgendaCliente;

