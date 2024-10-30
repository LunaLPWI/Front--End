import React, { useRef, useState, useEffect } from 'react';
import styles from './RedefinirSenha.module.css';
import Botao from '../../components/Botao/Botao';

export function OTP({
    tokenDigitado, setTokenDigitado,
    handleOtpConfirmed,
    handleSendEmail
}) {
    const [reenviarHabilitado, setReenviarHabilitado] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(300); // 5 minutos (300 segundos)

    //==================================================================================================

    //**LÓGICA DO INPUT TOKEN**
    const inputsRef = useRef([]);

    const handleChange = (element, index) => {
        const value = element.target.value;
        if (isNaN(value)) return;

        let newOtp = [...tokenDigitado];
        newOtp[index] = value;
        setTokenDigitado(newOtp);

        if (value !== '' && index < tokenDigitado.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Backspace' && index > 0 && tokenDigitado[index] === '') {
            inputsRef.current[index - 1].focus();
        }
    };
    //**LÓGICA DO INPUT TOKEN**

    //==================================================================================================

    useEffect(() => {
        if (tempoRestante > 0) {
            const timer = setInterval(() => {
                setTempoRestante((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setReenviarHabilitado(true);
        }
    }, [tempoRestante]);

    const handleReenviarClick = () => {
        if (reenviarHabilitado) {
            handleS(endEmail);
            setReenviarHabilitado(false);
            setTempoRestante(300); // Reinicia o temporizador de 5 minutos
        }
    };

    const formatarTempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
    };

    return (
        <section className={styles.section}>
            <div className={styles.imagem}></div>
            <section className={styles.formulario}>
                <form name='formOtp' onSubmit={handleOtpConfirmed} className={styles['form-redefinir-senha']}>
                    <h1 className={styles['h1-redefinir-senha']}>TOKEN</h1>
                    <p className={`${styles.principal} ${styles.otp}`}>Um token foi enviado para <br /> o e-mail associado à sua conta.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {tokenDigitado.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={tokenDigitado[index]}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                style={{
                                    border: '1px solid red',
                                    borderRadius: '10px',
                                    width: '60px',
                                    height: '60px',
                                    fontSize: '20px',
                                    textAlign: 'center',
                                    margin: '40px 10px'
                                }}
                            />
                        ))}
                    </div>
                    <div className={styles.botoes}>
                        <Botao
                            tipo="submit"
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="ENVIAR" />
                    </div>
                    <p className={styles.principal}>
                        O email não chegou?
                        {reenviarHabilitado ? (
                            <u className={styles.reenviar} onClick={handleReenviarClick}>reenviar email</u>
                        ) : (
                            <span className={styles.desabilitado}>
                                reenvio disponível em {formatarTempo(tempoRestante)}
                            </span>
                        )}
                    </p>
                </form>
            </section>
        </section>
    );
}
