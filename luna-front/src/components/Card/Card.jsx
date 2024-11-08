import '../../global.css';
import styles from '../Card/Card.module.css';

function Card({ imageSrc, altText, title, onClick, className, texto }) {
    return (
      <div className={`${styles.card} ${className}`}>
        <img src={imageSrc} alt={altText} />
        <h2>{title}</h2>
        <a onClick={onClick}>{texto}</a>
      </div>
    );
  }

export default Card;
