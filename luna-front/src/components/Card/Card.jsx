import '../../global.css';
import styles from '../Card/Card.module.css';

function Card({ imageSrc, altText, title }) {
    return (
        <div className={styles.card}>
            <img src={imageSrc} alt={altText} />
            <h2>{title}</h2>
            <a href="">AGENDAR</a>
        </div>
    );
}

export default Card;
