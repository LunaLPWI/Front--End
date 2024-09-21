import React from 'react';
import styles from './Header.module.css';
import domRoqueLogo from '../../assets/domRoque-logo.svg';

export function Header({ links }) {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.navList}>
                    {links.slice(0, 2).map((link, index) => (
                        <li key={index}>
                            <a href={link.href}>{link.title}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <img src={domRoqueLogo} alt="Dom Roque logo" className={styles.logo} />
            <nav>
                <ul className={styles.navList}>
                    {links.slice(2).map((link, index) => (
                        <li key={index + 2}>
                            <a href={link.href}>{link.title}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
