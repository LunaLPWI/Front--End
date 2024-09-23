import React, { useState } from 'react';
import styles from './Header.module.css';
import domRoqueLogo from '../../assets/domRoque-logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {


    return (
        <header className={styles.header}>
            <Link to="/" className={styles.button}>SAIR</Link>
            <nav className={styles.navfull}>
                <nav className={styles.navbar}>
                    <ul className={styles.navList}>
                        <li>
                            <Link 
                                to="/" 
                            >
                                PLANOS
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/" 

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
                            >
                                AGENDAR
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/" 
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
