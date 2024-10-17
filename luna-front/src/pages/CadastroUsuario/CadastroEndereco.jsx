// CadastroEndereco.jsx
import React, { useEffect } from 'react';
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./CadastroEndereco.module.css";
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { mascaraCEP } from '../../utils/global';

export function CadastroEndereco({
    cep, setCep,
    rua, setRua,
    numero, setNumero,
    complemento, setComplemento,
    bairro, setBairro,
    cidade, setCidade,
    estado, setEstado,
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
                setRua(dados.logradouro || '');
                setBairro(dados.bairro || '');
                setCidade(dados.localidade || '');
                setEstado(dados.uf || '');
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            toast.error("Erro ao buscar o CEP. Por favor, tente novamente.");
            limpaCamposEndereco();
        }
    };

    // Função para limpar os campos de endereço
    const limpaCamposEndereco = () => {
        setRua('');
        setBairro('');
        setCidade('');
        setEstado('');
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
        <div className={styles['container-endereco']}>
            <div className={styles.imagem}></div>
            <section className={styles['formulario-endereco']}>
                <form onSubmit={salvarDados}>
                    <h1>ENDEREÇO</h1>
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
                            valor={rua}
                            aoAlterado={setRua}
                            label="RUA"
                            placeholder="Rua Caleb Pereira"
                            readOnly={true}
                        />
                        <hr />

                        <div className={styles['numero-complemento']}>

                            {/* NÚMERO */}
                            <CampoTexto
                                tipo='number'
                                valor={numero}
                                aoAlterado={setNumero}
                                obrigatorio={true}
                                label="NÚMERO"
                                placeholder="123"
                                min="1"
                            />
                            <hr />

                            {/* COMPLEMENTO */}
                            <CampoTexto
                                tipo='text'
                                valor={complemento}
                                aoAlterado={setComplemento}
                                label="COMPLEMENTO"
                                placeholder="Bloco A, Ap 2"
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
                                valor={estado}
                                aoAlterado={setEstado}
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

CadastroEndereco.propTypes = {
    cep: PropTypes.string.isRequired,
    setCep: PropTypes.func.isRequired,
    rua: PropTypes.string.isRequired,
    setRua: PropTypes.func.isRequired,
    numero: PropTypes.string.isRequired,
    setNumero: PropTypes.func.isRequired,
    complemento: PropTypes.string.isRequired,
    setComplemento: PropTypes.func.isRequired,
    bairro: PropTypes.string.isRequired,
    setBairro: PropTypes.func.isRequired,
    cidade: PropTypes.string.isRequired,
    setCidade: PropTypes.func.isRequired,
    estado: PropTypes.string.isRequired,
    setEstado: PropTypes.func.isRequired,
    voltarEtapa: PropTypes.func.isRequired,
    salvarDados: PropTypes.func.isRequired,
};