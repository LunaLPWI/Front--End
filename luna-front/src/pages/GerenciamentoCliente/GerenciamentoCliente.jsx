import '../../global.css';
import Header from '../../components/Header/Header';
import DynamicTable from '../../components/Table/Table';
import { useUser } from '../../context/userContext';
import styles from './GerenciamentoCliente.module.css';
import { useNavigate } from 'react-router-dom';

function GerenciamentoCliente() {
    
    const { user } = useUser();

    const links = [
        { name: 'DASHBOARD', path: '/dashboard' },
        { name: 'CLIENTES', path: '/agenda-clientes' },
        { name: 'AGENDAS', path: '' },
        { name: 'ESTOQUE', path: '/estoque' }
    ];

    const navigate = useNavigate()
    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const headers = ['Nome completo', 'Plano', 'Vencimento do plano', 'Status', 'Celular'];
    const data = [
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
        ['João Caetano', 'Plano A', '20/03/2025', 'Ativo', '(11) 93243-3242'],
    ];
    return (
        <div>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleLogoutClick}
            />
            <section className={styles.management}>
                <div className={styles.containerManagement}>
                    <h1>GERENCIAMENTO DOS CLIENTES - VISÃO GERAL</h1>
                    <DynamicTable headers={headers} data={data} useFilter={true} usePagination={true} />
                </div>
            </section>
        </div>
    );
}

export default GerenciamentoCliente;