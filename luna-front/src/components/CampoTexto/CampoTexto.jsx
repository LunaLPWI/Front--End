import styles from './CampoTexto.module.css';

const CampoTexto = (props) => {
    
    const aoDigitado = (evento) => {
        props.aoAlterado(evento.target.value);
    }

    return (
        <div className={`${styles['campo-texto']} ${styles.label} ${styles.input}`}>
            <label>{props.label}</label>
            <input 
                type={props.tipo}
                value={props.valor} 
                onChange={aoDigitado} 
                required={props.obrigatorio}
                onInput={props.onInput} 
                placeholder={props.placeholder}
            />
        </div>
    );
}

export default CampoTexto;
