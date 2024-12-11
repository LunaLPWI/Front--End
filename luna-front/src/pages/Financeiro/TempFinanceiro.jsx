import { useState, useEffect } from 'react';
import '../../global.css';
import Header from '../../components/Header/Header';
import DashFrequencia from '../../dashboards/dashFrequencia/dashFrequencia';
import DashReceita from '../../dashboards/dashReceita/dashReceita';
import DashColaborador from '../../dashboards/dashColaborador/dashColaborador';
import DashQuantitativo from '../../dashboards/dashQuantitativo/dashQuantitativo';
import ExportarCSV from "../../components/exportarCSV/exportarCSV";
import { useNavigate } from 'react-router-dom';
import styles from '../Financeiro/Financeiro.module.css';

function Financeiro() {
    const [planosAtivos, setPlanosAtivos] = useState(0);  // Inicia com 0 por padrão
    const [frequent, setFrequent] = useState(0);  // Inicia com 0 por padrão para o frequent
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const links = [
        { name: 'ESTOQUE', path: '/estoque' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'CLIENTES', path: '/agenda-clientes' },
        { name: 'GERENCIAMENTO', path: '/gerenciamento-clientes' },
    ];

    const navigate = useNavigate();
    
    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const user = sessionStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    const token = parsedUser && parsedUser.token ? parsedUser.token : null;

    useEffect(() => {
        // Fetch de Planos Ativos
        const fetchPlanosAtivos = async () => {
            setLoading(true);
            setError(null);  
            try {
                const response = await fetch('http://localhost:8081/plans/count-by-plans', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
                }

                const data = await response.text();  
                if (data) {
                    try {
                        const jsonData = JSON.parse(data);  
                        setPlanosAtivos(jsonData.count !== undefined ? jsonData.count : 0);  
                    } catch (e) {
                        setPlanosAtivos(0);  
                    }
                } else {
                    setPlanosAtivos(0);  
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);  
            }
        };

        // Fetch de Alerta de Frequência
        const fetchFrequent = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8081/finance/revenue/frequence', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar frequência: ${response.statusText}`);
                }

                const data = await response.json();
                const frequentValue = parseFloat(data.frequentes) || 0;
                setFrequent(frequentValue);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPlanosAtivos();
            fetchFrequent();
        }
    }, [token]);

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
                                    <h2>Planos Ativos</h2>
                                    {loading ? (
                                        <p>Carregando...</p>
                                    ) : (
                                        <p>{planosAtivos}</p> 
                                    )}
                                </div>
                                <div className={styles.cardSmall}>
                                    <h2>Alerta de Frequência</h2>
                                    {loading ? (
                                        <p>Carregando...</p>
                                    ) : (
                                        <p>{frequent}</p> 
                                    )}
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
                {token && <ExportarCSV token={token} />}
            </section>
        </>
    );
}

export default Financeiro;
