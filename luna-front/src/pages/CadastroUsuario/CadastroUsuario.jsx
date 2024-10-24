// CadastroUsuario.jsx
import React from 'react';
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./Cadastro.module.css";
import { useNavigate } from 'react-router-dom';
import { mascaraCelular, mascaraCPF } from '../../utils/global';

export function CadastroUsuario({
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    cellphone, setCellphone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    avancarEtapa
}) {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        avancarEtapa();
    };

    return (
        <div className={styles['container-cadastro']}>
            <div className={styles.imagem}></div>
            <section className={styles['section-usuario']}>
                <form onSubmit={handleSubmit} className={styles['form-cadastro']}>
                    <h1 className={styles['h1-cadastro']}>CADASTRO</h1>
                    <div className={`${styles.inputs}`}>

                        {/* NOME */}
                        <CampoTexto
                            tipo='text'
                            valor={nome}
                            aoAlterado={setNome}
                            obrigatorio={false}
                            label="NOME"
                            placeholder="Igor Silva"
                            maxLength="50"
                        />
                        <hr />

                        {/* EMAIL */}
                        <CampoTexto
                            tipo='text'
                            valor={email}
                            aoAlterado={setEmail}
                            obrigatorio={false}
                            label="EMAIL"
                            placeholder="exemplo@exemplo.com"
                            maxLength="50"
                        />
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
                                placeholder="123.123.123-12"
                            />
                            <hr />

                            {/* CELULAR */}
                            <CampoTexto
                                tipo='phone'
                                valor={cellphone}
                                aoAlterado={setCellphone}
                                obrigatorio={false}
                                onInput={mascaraCelular}
                                label="CELULAR"
                                placeholder="(11) 91234-1234"
                            />
                        </div>
                        <hr />

                        {/* SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={password}
                            aoAlterado={setPassword}
                            obrigatorio={false}
                            label="SENHA"
                            placeholder="Digite sua senha"
                            maxLength="30"
                        />

                        <hr />

                        {/* CONFIRMAR SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={confirmPassword}
                            aoAlterado={setConfirmPassword}
                            obrigatorio={false}
                            label="CONFIRMAR SENHA"
                            placeholder="Digite novamente sua senha"
                            maxLength="30"
                        />
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