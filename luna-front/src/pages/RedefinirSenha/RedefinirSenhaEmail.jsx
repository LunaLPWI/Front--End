import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./RedefinirSenha.module.css";
import { useNavigate } from "react-router-dom";

export function RedefinirSenhaEmail({
    email, setEmail,
    handleSendEmail
}) {

    const navigate = useNavigate();

    return (
        <section className={styles.section}>
            <div className={styles.imagem}></div>
            <section className={styles.formulario}>
                <form name="form-redefinir-email" className={styles['form-redefinir-senha']}>
                    <h1 className={styles['h1-redefinir-senha']}>REDEFINIR SENHA</h1>
                    <p className={styles.principal}>Um link para redefinir sua senha será <br /> enviado a o e-mail associado à sua conta. </p>
                    <div className={`${styles.inputs} `}>
                        <CampoTexto
                            tipo='email'
                            valor={email}
                            aoAlterado={valor => setEmail(valor)} obrigatorio={true} label="EMAIL" placeholder="exemplo@exemplo.com" />
                    </div>
                    <div className={styles.botoes}>
                        <Botao
                            onClick={() => navigate('/login')}
                            corFundo="white"
                            corTexto="red"
                            tamanho="size100"
                            texto="VOLTAR" />
                        <Botao
                            onClick={handleSendEmail}
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="ENVIAR" />
                    </div>
                </form>
            </section>
        </section>
    );
}
