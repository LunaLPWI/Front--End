import React, { useState } from 'react';
import styles from './Header.module.css';
import domRoqueLogo from '../../assets/domRoque-logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {

    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navfull}>
                <nav className={styles.navbar}>
                    <ul className={styles.navList}>
                        <li>
                            <Link
                                to="/planos"
                                className={activeLink === '/planos' ? styles.active : ''}
                                onClick={() => handleLinkClick('/planos')}
                            >
                                PLANOS
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/perfil"
                                className={activeLink === '/perfil' ? styles.active : ''}
                                onClick={() => handleLinkClick('/perfil')}
                            >
                                PERFIL
                            </Link>
                        </li>
                    </ul>
                </nav>
                <img src={domRoqueLogo} alt="Dom Roque logo" className={styles.logo} />
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <Link
                                to="/agendamento-servicos"
                                className={activeLink === '/agendamento-servicos' ? styles.active : ''}
                                onClick={() => handleLinkClick('/agendamento-servicos')}
                            >
                                AGENDAR
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/"
                                className={activeLink === '/' ? styles.active : ''}
                                onClick={() => handleLinkClick('/')}
                            >
                                MEUS AGENDAMENTOS
                            </Link>
                        </li>
                    </ul>
                </nav>
            </nav>
        </header>
    );
};
export default Header;