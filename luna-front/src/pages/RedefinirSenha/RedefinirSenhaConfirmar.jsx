import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./RedefinirSenha.module.css";

export function RedefinirSenhaConfirmar({
    senha, setSenha,
    confirmarSenha, setConfirmarSenha,
    handleUpdatePassword
}) {

    return (
        <section className={styles.section}>
            <div className={styles.imagem}></div>
            <section className={styles.formulario}>
                <form name="form-redefinir-confirmar" className={styles['form-redefinir-senha']}>
                    <h1 className={styles['h1-redefinir-senha']}>REDEFINIR SENHA</h1>
                    <div className={styles.textos}>
                        <p className={styles.principal}>Digite a sua nova senha <br /><br /> </p>
                        <div className={styles['apoio-requisitos']}>
                            <p className={styles.requisitos}>
                                <strong>Requisitos minimos:</strong>
                                <br />
                                •Conter 6 caracteres <br />
                                •Um número <br />
                                •Um caracter especial <br />
                                •Não pode conter espaços
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.inputs} `}>

                        {/* SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={senha}
                            aoAlterado={valor => setSenha(valor)}
                            obrigatorio={true}
                            label="SENHA"
                            placeholder="**********" />
                        <hr />
                        {/* CONFIRMAR SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={confirmarSenha}
                            aoAlterado={valor => setConfirmarSenha(valor)}
                            obrigatorio={true}
                            label="CONFIRMAR SENHA"
                            placeholder="**********" />
                    </div>
                    <div className={styles.botoes}>
                        <Botao
                            onClick={handleUpdatePassword}
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="ATUALIZAR" />
                    </div>
                </form>
            </section>
            <p className={styles.classe}></p>
        </section>
    );
}
