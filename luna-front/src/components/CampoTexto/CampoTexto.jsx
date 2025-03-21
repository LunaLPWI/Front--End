import styles from './CampoTexto.module.css';

const CampoTexto = (props) => {

    const aoDigitado = (evento) => {
        if (!props.readOnly) {
            props.aoAlterado(evento.target.value);
        }
    }

    return (
        <div
            className={`${styles['campo-texto']} ${props.divClassName}`} 
            style={props.divStyle}
        >
            <label
                style={props.labelStyle}
                className={`${styles.label} ${props.labelClassName}`}
            >
                {props.label}
            </label>
            <input
                type={props.tipo}
                value={props.valor}
                onChange={aoDigitado}
                required={props.obrigatorio}
                onInput={props.onInput}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                min={props.min}
                maxLength={props.maxLength}
                style={props.inputStyle}
                className={`${styles.input} ${props.className}`}
            />
        </div>
    );
}

export default CampoTexto;
