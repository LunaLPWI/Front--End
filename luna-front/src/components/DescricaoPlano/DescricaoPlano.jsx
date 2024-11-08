import { ArrowLeft } from 'phosphor-react';
import styles from '../Card/Card.module.css'

export const DescricaoPlano = ({ plano, texto, preco, botao, onSetinhaClick, onBotaoClick, className }) => {
    return (
      <div className={`${styles.card} ${className}`}>
        <div className={styles.relative}>
          <div className={styles.setinha} onClick={onSetinhaClick}>
            <ArrowLeft size={25} color="#ff0000" weight="regular" />
          </div>
          <div className={styles.text}>
            <h2>{plano}</h2>
            <p dangerouslySetInnerHTML={{ __html: texto }}></p>
          </div>
          <p>
            <span className={styles.preco}>R${preco}</span> / mensalmente
          </p>
          <button onClick={onBotaoClick}>{botao}</button>
        </div>
      </div>
    );
  };