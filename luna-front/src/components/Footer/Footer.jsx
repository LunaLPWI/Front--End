import styles from './../Footer/Footer.module.css';
import domRoqueLogo from '../../assets/domRoque-logo.svg';
import mapImage from '../../assets/mapa.png'; 

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.infoFooter}>
                <div className={styles.logoSection}>
                    <img src={domRoqueLogo} alt="logo da Dom Roque" className={styles.logo} />
                    <hr />
                    <nav className={styles.navLinks}>
                        <a href="#">Sobre nós</a>
                        <a href="#">Serviços</a>
                        <a href="#">Funcionamento</a>
                        <a href="#">Entrar</a>
                    </nav>
                </div>
                <div className={styles.addressSection}>
                    <a href="https://www.google.com/maps/dir//R.+Trist%C3%A3o+de+Alencar+Araripe+J%C3%BAnior,+388+-+Vila+Uniao+(Zona+Leste),+S%C3%A3o+Paulo+-+SP,+03272-060/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x94ce67f55408ddbb:0x90d40063b370f0e?sa=X&ved=1t:707&ictx=111">
                        <img src={mapImage} alt="Mapa do local" className={styles.map} />
                    </a>
                    <p>
                        R. Tristão de Alencar Araripe Júnior, 388<br />
                        Vila Uniao (Zona Leste), São Paulo - SP, 03272-060
                    </p>
                </div>
            </div>
            <div className={styles.copyrightFooter}>
                <p>©Copyright 2024 - Dom Roque / Luna</p>
            </div>
        </footer>
    );
}

export default Footer;
