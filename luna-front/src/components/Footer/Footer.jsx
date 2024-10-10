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
                        <a href="#sobre-nos">Sobre nós</a>
                        <a href="#servicos">Serviços</a>
                        <a href="#funcionamento">Funcionamento</a>
                        <a href="/entrar">Entrar</a>
                    </nav>
                </div>
                <div className={styles.addressSection}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.0493401313465!2d-46.518590624438836!3d-23.602563363107695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce67f55408ddbb%3A0x90d40063b370f0e!2sR.%20Trist%C3%A3o%20de%20Alencar%20Araripe%20J%C3%BAnior%2C%20388%20-%20Vila%20Uniao%20(Zona%20Leste)%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003272-060!5e0!3m2!1spt-BR!2sbr!4v1728429603542!5m2!1spt-BR!2sbr" width="280" height="250" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title='Google Maps'></iframe>
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
