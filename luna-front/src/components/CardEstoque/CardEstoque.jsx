import styles from './CardEstoque.module.css';
import { ArrowRight } from "phosphor-react";

export const CardEstoque = ({ imagem, label, onClick, isSelected }) => {
  return (
    <div className={styles['card-wrapper']} onClick={onClick}>
      <div className={styles['section-card-estoque']}>
        <img src={imagem} alt="imagem" />
        <h1>{label}</h1>
      </div>
      {isSelected && <span className={styles.arrow}><ArrowRight size={64} color="#ff0000" weight="bold" /></span>} {/* Setinha */}
    </div>
  );
};
