// Cadastro.jsx
import React, { useState } from 'react';
import { CadastroUsuario } from './CadastroUsuario';
import { CadastroEndereco } from './CadastroEndereco';
import styles from "./Cadastro.module.css";
import { api } from "../../api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { validarCPF } from '../../utils/global';
import { limparMascara, inputSomenteTexto, validarSenha, regexEmail } from '../../utils/global';

export const Cadastro = () => {

    const navigate = useNavigate();

    //==================================================================================================

    //**CADASTRO USUARIO**
    const [nome, setNome] = useState('teste');
    const [email, setEmail] = useState('teste@gmail.com');
    const [cpf, setCpf] = useState('725.495.760-55');
    const [cellphone, setCellphone] = useState('(11) 91234-5678');
    const [dataNasc, setDataNasc] = useState();
    const [password, setPassword] = useState('teste1@teste');
    const [confirmPassword, setConfirmPassword] = useState('teste1@teste');

    //**CADASTRO ENDEREÇO**
    const [cep, setCep] = useState('65040-550');
    const [logradouro, setLogradouro] = useState('');
    const [number, setNumber] = useState('1123');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');

    //==================================================================================================

    const [etapa, setEtapa] = useState(1);

    //==================================================================================================

    //**LÓGICA DE AVANÇAR ETAPA VALIDANDO AS INPUTS**

    const avancarEtapa = () => {

        if (!inputSomenteTexto(nome)) {
            toast.error("Por favor, insira um nome válido (mínimo 2 caracteres).",{
            autoClose: 2000,
            closeOnClick: true
        });
            return;
        }

        if (!regexEmail(email)) {
            toast.error("Por favor, insira um e-mail válido.", {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!validarSenha(password)) {
            toast.error(`A senha deve ter no mínimo:\n
                 • 6 caracteres\n
                 • Um número\n
                 • Um caractere especial\n
                 • Não pode conter espaços
                `, {
                autoClose: 5000,
                closeOnClick: true
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.", {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (validarCPF(cpf) === false) {
            toast.error("CPF inválido", {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        setEtapa(2);
    };
    //**LÓGICA DE AVANÇAR ETAPA VALIDANDO AS INPUTS**

    //==================================================================================================


    const voltarEtapa = () => {
        setEtapa(1);
    };

    //==================================================================================================

    //**LÓGICA DO POST**

    const salvarDados = (e) => {
        e.preventDefault();

        const cpfSemMascara = limparMascara(cpf);
        const celularSemMascara = limparMascara(cellphone);
        const cepSemMascara = limparMascara(cep);

        const regexCep = /^\d{5}-?\d{3}$/;
        const regexRua = /^[A-Za-zÀ-ÿ0-9\s]{2,}$/;
        const regexNumero = /^\d+$/;
        const regexComplemento = /^[A-Za-zÀ-ÿ0-9\s]*$/;
        const regexBairro = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        const regexCidade = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        const regexEstado = /^[A-Za-z]{2}$/;

        if (!regexCep.test(cep)) {
            toast.error("Por favor, insira um CEP válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexRua.test(logradouro)) {
            toast.error("Por favor, insira um nome de rua válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexNumero.test(number)) {
            toast.error("Por favor, insira um número válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexComplemento.test(complemento)) {
            toast.error("Por favor, insira um complemento válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexBairro.test(bairro)) {
            toast.error("Por favor, insira um nome de bairro válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexCidade.test(cidade)) {
            toast.error("Por favor, insira um nome de cidade válido.", {
                autoClose: 2000,
                closeOnClick: true
            }, {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }

        if (!regexEstado.test(uf)) {
            toast.error("Por favor, insira um estado válido (ex: SP, RJ).", {
                autoClose: 2000,
                closeOnClick: true
            });
            return;
        }



        const objetoAdicionado = {
            name: nome,
            cpf: cpfSemMascara,
            email: email,
            phoneNumber: celularSemMascara,
            password: password,
            address: {
                cep: cepSemMascara,
                logradouro: logradouro,
                complemento: complemento,
                cidade: cidade,
                bairro: bairro,
                uf: uf,
                number: number
            },
            birthDay: dataNasc,
        };
        api.post('/clients', objetoAdicionado)
            .then(() => {
                toast.success("Usuário cadastrado com sucesso!", {
                    autoClose: 2000,
                    closeOnClick: true
                });
                setTimeout(() => {
                    navigate("/login")
                }, 1000)

            })
            .catch((e) => {
                if (e.status === 409) {
                    toast.warn("Email ou CPF já existente", {
                        autoClose: 2000,
                        closeOnClick: true
                    });
                } else {
                    toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.", {
                        autoClose: 2000,
                        closeOnClick: true
                    });
                }
            });
    };
    //**LÓGICA DO POST**

    //==================================================================================================

    return (
        <main className={styles['main-cadastro']}>
            <section className={styles['section-cadastro']}>
                {etapa === 1 && (
                    <CadastroUsuario
                        nome={nome}
                        setNome={setNome}
                        email={email}
                        setEmail={setEmail}
                        cpf={cpf}
                        setCpf={setCpf}
                        cellphone={cellphone}
                        setCellphone={setCellphone}
                        dataNasc={dataNasc}
                        setDataNasc={setDataNasc}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        avancarEtapa={avancarEtapa}
                    />
                )}
                {etapa === 2 && (
                    <CadastroEndereco
                        cep={cep}
                        setCep={setCep}
                        logradouro={logradouro}
                        setLogradouro={setLogradouro}
                        number={number}
                        setNumber={setNumber}
                        complemento={complemento}
                        setComplemento={setComplemento}
                        bairro={bairro}
                        setBairro={setBairro}
                        cidade={cidade}
                        setCidade={setCidade}
                        uf={uf}
                        setUf={setUf}
                        voltarEtapa={voltarEtapa}
                        salvarDados={salvarDados}
                    />
                )}
            </section>
        </main>
    );
}