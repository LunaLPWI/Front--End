// CadastroEndereco.jsx
import React, { useEffect } from 'react';
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./CadastroFuncionario.module.css";
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { mascaraCEP, inputNumerosDecimais } from '../../utils/global';

export function CadastroEnderecoFuncionario({
    cep, setCep,
    logradouro, setLogradouro,
    number, setNumber,
    complemento, setComplemento,
    bairro, setBairro,
    cidade, setCidade,
    uf, setUf,
    voltarEtapa,
    salvarDados
}) {

    

    const buscarEndereco = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = response.data;

            if (dados.erro) {
                toast.error("CEP não encontrado.");
                limpaCamposEndereco();
            } else {
                setLogradouro(dados.logradouro || '');
                setBairro(dados.bairro || '');
                setCidade(dados.localidade || '');
                setUf(dados.uf || '');
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            toast.error("Erro ao buscar o CEP. Por favor, tente novamente.");
            limpaCamposEndereco();
        }
    };

    // Função para limpar os campos de endereço
    const limpaCamposEndereco = () => {
        setLogradouro('');
        setBairro('');
        setCidade('');
        setUf('');
    };

    // useEffect para monitorar mudanças no CEP e buscar o endereço quando válido
    useEffect(() => {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            buscarEndereco(cepLimpo);
        } else {
            limpaCamposEndereco();
        }
    }, [cep]);

    return (
        <div className={styles['container-cadastro']}>
            <div className={styles.imagem}></div>
            <section className={styles['formulario-cadastro']}>
                <form onSubmit={salvarDados} className={styles['form-cadastro']}>
                    <h1 className={styles['h1-cadastro']}>ENDEREÇO</h1>
                    <div className={`${styles.inputs}`}>

                        {/* CEP */}
                        <CampoTexto
                            tipo='text'
                            valor={cep}
                            aoAlterado={setCep}
                            obrigatorio={true}
                            onInput={mascaraCEP}
                            label="CEP"
                            placeholder="12345-203"
                        />
                        <hr />

                        {/* RUA */}
                        <CampoTexto
                            tipo='text'
                            valor={logradouro}
                            aoAlterado={setLogradouro}
                            label="Logradouro"
                            placeholder="Rua Caleb Pereira"
                            readOnly={true}
                        />
                        <hr />

                        <div className={styles['numero-complemento']}>

                            {/* NÚMERO */}
                            <CampoTexto
                                tipo='text'
                                valor={number}
                                aoAlterado={setNumber}
                                obrigatorio={true}
                                onInput={inputNumerosDecimais}
                                label="NÚMERO"
                                placeholder="123"
                                min="1"
                                maxLength="5"
                            />
                            <hr />
                            
                            {/* COMPLEMENTO */}
                            <CampoTexto
                                tipo='text'
                                valor={complemento}
                                aoAlterado={setComplemento}
                                label="COMPLEMENTO"
                                placeholder="Bloco A, Ap 2"
                                maxLength="50"
                            />
                        </div>
                        <hr />

                        {/* BAIRRO */}
                        <CampoTexto
                            tipo='text'
                            valor={bairro}
                            aoAlterado={setBairro}
                            obrigatorio={false}
                            label="BAIRRO"
                            placeholder="Vila Emma"
                            readOnly={true}
                        />
                        <hr />

                        <div className={styles['cidade-estado']}>

                            {/* CIDADE */}
                            <CampoTexto
                                tipo='text'
                                valor={cidade}
                                aoAlterado={setCidade}
                                obrigatorio={false}
                                label="CIDADE"
                                placeholder="São Paulo"
                                readOnly={true}
                            />
                            <hr />

                            {/* ESTADO */}
                            <CampoTexto
                                tipo='text'
                                valor={uf}
                                aoAlterado={setUf}
                                obrigatorio={false}
                                label="ESTADO"
                                placeholder="SP"
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className={styles.botoes}>

                        {/* VOLTAR */}
                        <Botao
                            tipo="button"
                            onClick={voltarEtapa}
                            corFundo="white"
                            corTexto="red"
                            tamanho="size100"
                            texto="VOLTAR"
                        />

                        {/* SALVAR */}
                        <Botao
                            tipo="submit"
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="CADASTRAR"
                        />
                    </div>
                </form>
            </section>
        </div>
    );
}

CadastroEnderecoFuncionario.propTypes = {
    cep: PropTypes.string.isRequired,
    setCep: PropTypes.func.isRequired,
    logradouro: PropTypes.string.isRequired,
    setLogradouro: PropTypes.func.isRequired,
    number: PropTypes.string.isRequired,
    setNumber: PropTypes.func.isRequired,
    complemento: PropTypes.string.isRequired,
    setComplemento: PropTypes.func.isRequired,
    bairro: PropTypes.string.isRequired,
    setBairro: PropTypes.func.isRequired,
    cidade: PropTypes.string.isRequired,
    setCidade: PropTypes.func.isRequired,
    uf: PropTypes.string.isRequired,
    setUf: PropTypes.func.isRequired,
    voltarEtapa: PropTypes.func.isRequired,
    salvarDados: PropTypes.func.isRequired,
};