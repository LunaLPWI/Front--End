// Cadastro.jsx
import React, { useState } from 'react';
import { CadastroUsuario } from './CadastroUsuario';
import { CadastroEndereco } from './CadastroEndereco';
import styles from "./Cadastro.module.css";
import { api } from "../../api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { validarCPF } from '../../utils/global';
import { limparMascara } from '../../utils/global';

export const Cadastro = () => {

    const navigate = useNavigate();

    //==================================================================================================

    //**CADASTRO USUARIO**
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //**CADASTRO ENDEREÇO**
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [number, setNumber] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');

    //==================================================================================================

    const [etapa, setEtapa] = useState(1);

    //==================================================================================================

    //**LÓGICA DE AVANÇAR ETAPA VALIDANDO AS INPUTS**

    const avancarEtapa = () => {
        const regexNome = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexCpf = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
        const regexCelular = /^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/;
        const regexSenha = /^.{6,}$/;

        if (!regexNome.test(nome)) {
            toast.error("Por favor, insira um nome válido (mínimo 2 caracteres).");
            return;
        }

        if (!regexEmail.test(email)) {
            toast.error("Por favor, insira um e-mail válido.");
            return;
        }

        if (!regexCpf.test(cpf)) {
            toast.error("Por favor, insira um CPF válido.");
            return;
        }

        if (!regexCelular.test(cellphone)) {
            toast.error("Por favor, insira um número de celular válido.");
            return;
        }

        if (!regexSenha.test(password)) {
            toast.error("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        if (validarCPF(cpf) === false) {
            toast.error("CPF inválido");
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
            toast.error("Por favor, insira um CEP válido.");
            return;
        }

        if (!regexRua.test(logradouro)) {
            toast.error("Por favor, insira um nome de rua válido.");
            return;
        }

        if (!regexNumero.test(number)) {
            toast.error("Por favor, insira um número válido.");
            return;
        }

        if (!regexComplemento.test(complemento)) {
            toast.error("Por favor, insira um complemento válido.");
            return;
        }

        if (!regexBairro.test(bairro)) {
            toast.error("Por favor, insira um nome de bairro válido.");
            return;
        }

        if (!regexCidade.test(cidade)) {
            toast.error("Por favor, insira um nome de cidade válido.");
            return;
        }

        if (!regexEstado.test(uf)) {
            toast.error("Por favor, insira um estado válido (ex: SP, RJ).");
            return;
        }



        const objetoAdicionado = {
            nome,
            cpf: cpfSemMascara,
            email,
            cellphone: celularSemMascara,
            password,
            adress: {
                cep: cepSemMascara,
                logradouro,
                complemento,
                cidade,
                bairro,
                uf,
                number
            }
        };
        console.log(objetoAdicionado)
        api.post('/clients', {
            nome,
            cpf,
            email,
            cellphone,
            password,
            adress: {
                cep,
                logradouro,
                complemento,
                cidade,
                bairro,
                uf,
                number
            }
        })
            .then(() => {
                toast.success("Usuário criado com sucesso!");
                sessionStorage.setItem("editado",
                    JSON.stringify(objetoAdicionado));
                navigate("/login")

            })
            .catch((e) => {
                toast.error("Ocorreu um erro ao salvar os dados, por favor, tente novamente.");
                console.log(e)
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