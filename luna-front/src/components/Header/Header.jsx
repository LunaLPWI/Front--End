import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Header.module.css';
import domRoqueLogo from '../../assets/domRoque-logo.svg';
import { Link } from 'react-router-dom';

const Header = ({ links, showButton, buttonText, onButtonClick }) => {
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <header className={styles.header}>
            {showButton && (
                <button className={styles.button} onClick={onButtonClick}>
                    {buttonText}
                </button>
            )}
            <nav className={styles.navfull}>
                <nav className={styles.navbar}>
                    <ul className={styles.navList}>
                        {links.slice(0, 2).map((link, index) => (
                            <li key={index}>
                                {link.path.startsWith('#') ? (
                                    <a
                                        href={link.path}
                                        className={activeLink === link.path ? styles.active : ''}
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={activeLink === link.path ? styles.active : ''}
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <img src={domRoqueLogo} alt="Dom Roque logo" className={styles.logo} />
                <nav className={styles.navbar}>
                    <ul className={styles.navList}>
                        {links.slice(2).map((link, index) => (
                            <li key={index}>
                                {link.path.startsWith('#') ? (
                                    <a
                                        href={link.path}
                                        className={activeLink === link.path ? styles.active : ''}
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={activeLink === link.path ? styles.active : ''}
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </nav>
        </header>
    );
};

Header.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ).isRequired,
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    onButtonClick: PropTypes.func,
};

export default Header;
