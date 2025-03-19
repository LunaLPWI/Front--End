// CadastroUsuario.jsx
import React from 'react';
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./CadastroFuncionario.module.css";
import { useNavigate } from 'react-router-dom';
import { mascaraCelular, mascaraCPF } from '../../utils/global';

export function CadastroUsuarioFuncionario({
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    cellphone, setCellphone,
    dataNasc, setDataNasc,
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
                            />
                        </div>
                        <hr />

                        {/* DATA NASCIMENTO */}
                        <CampoTexto
                            tipo='date'
                            valor={dataNasc}
                            aoAlterado={setDataNasc}
                            obrigatorio={true}
                            label="DATA NASCIMENTO"
                            maxLength="12"
                        />

                        <hr />

                        {/* SENHA */}
                        <CampoTexto
                            tipo='password'
                            valor={password}
                            aoAlterado={setPassword}
                            obrigatorio={false}
                            label="SENHA"
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
