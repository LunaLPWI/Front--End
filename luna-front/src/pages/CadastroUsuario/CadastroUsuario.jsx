// CadastroUsuario.jsx
import React from 'react';
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./CadastroUsuario.module.css";
import { useNavigate } from 'react-router-dom';
import { mascaraCelular, mascaraCPF } from '../../utils/global';

export function CadastroUsuario({
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    celular, setCelular,
    senha, setSenha,
    confirmarSenha, setConfirmarSenha,
    avancarEtapa
}) {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        avancarEtapa();
    };

    return (
        <div className={styles['container-usuario']}>
            <div className={styles.imagem}></div>
            <section className={styles['section-usuario']}>
                <form onSubmit={handleSubmit}>
                    <h1>CADASTRO</h1>
                    <div className={`${styles.inputs}`}>

                        {/* NOME */}
                        <CampoTexto
                            tipo='text'
                            valor={nome}
                            aoAlterado={setNome}
                            obrigatorio={false}
                            label="NOME"
                            placeholder="Igor Silva" />
                        <hr />

                        {/* EMAIL */}
                        <CampoTexto
                            tipo='email'
                            valor={email}
                            aoAlterado={setEmail}
                            obrigatorio={false}
                            label="EMAIL"
                            placeholder="exemplo@exemplo.com" />
                        <hr />

                        <div className={styles['cpf-celular']}>

                            {/* CPF */}
                            <CampoTexto
                                tipo='text'
                                valor={cpf}
                                aoAlterado={setCpf}
                                obrigatorio={false}
                                onInput={mascaraCPF}
                                label="CPF"
                                placeholder="123.123.123-12" />
                            <hr />

                            {/* CELULAR */}
                            <CampoTexto
                                tipo='phone'
                                valor={celular}
                                aoAlterado={setCelular}
                                obrigatorio={false}
                                onInput={mascaraCelular}
                                label="CELULAR"
                                placeholder="(11) 91234-1234" />
                        </div>
                        <hr />

                        {/* SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={senha}
                            aoAlterado={setSenha}
                            obrigatorio={false}
                            label="SENHA"
                            placeholder="Digite sua senha" />
                        <hr />

                        {/* CONFIRMAR SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={confirmarSenha}
                            aoAlterado={setConfirmarSenha}
                            obrigatorio={false}
                            label="CONFIRMAR SENHA"
                            placeholder="Digite novamente sua senha" />
                    </div>

                    <div className={styles.botoes}>

                        {/* VOLTAR */}
                        <Botao
                            onClick={() => navigate('/login')}
                            tipo="text"
                            corFundo="white"
                            corTexto="red"
                            tamanho="size100"
                            texto="VOLTAR" />

                        {/* AVANÇAR */}
                        <Botao
                            tipo="submit"
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="AVANÇAR" />
                    </div>
                </form>
            </section>
        </div>
    );
}

export default CadastroUsuario;