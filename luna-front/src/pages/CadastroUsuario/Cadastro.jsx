// Cadastro.jsx
import React, { useState } from 'react';
import CadastroUsuario from './CadastroUsuario';
import CadastroEndereco from './CadastroEndereco';
import styles from "./Cadastro.module.css";
import api from "../../api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { validarCPF } from '../../utils/global';
import { limparMascara } from '../../utils/global';

export const Cadastro = () => {

    const navigate = useNavigate();

    // Estado para informações pessoais
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    // Estado para informações de endereço
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    // Estado para controlar a etapa do formulário
    const [etapa, setEtapa] = useState(1); // 1: Informações Pessoais, 2: Endereço

    const avancarEtapa = () => {
        // Regex para validações
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

        if (!regexCelular.test(celular)) {
            toast.error("Por favor, insira um número de celular válido.");
            return;
        }

        if (!regexSenha.test(senha)) {
            toast.error("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error("As senhas não coincidem.");
            return;
        }

        if (validarCPF(cpf) === false) {
            toast.error("CPF inválido");
            return;
        }

        setEtapa(2);
    };



    const voltarEtapa = () => {
        setEtapa(1);
    };

    const salvarDados = (e) => {
        e.preventDefault();

        // Limpar máscaras
        const cpfSemMascara = limparMascara(cpf);
        const celularSemMascara = limparMascara(celular);
        const cepSemMascara = limparMascara(cep);

        // Regex para validações de endereço
        const regexCep = /^\d{5}-?\d{3}$/;
        const regexRua = /^[A-Za-zÀ-ÿ0-9\s]{2,}$/;
        const regexNumero = /^\d+$/;
        const regexComplemento = /^[A-Za-zÀ-ÿ0-9\s]*$/;
        const regexBairro = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        const regexCidade = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        const regexEstado = /^[A-Za-z]{2}$/;

        // Validação dos campos de endereço
        if (!regexCep.test(cep)) {
            toast.error("Por favor, insira um CEP válido.");
            return;
        }

        if (!regexRua.test(rua)) {
            toast.error("Por favor, insira um nome de rua válido.");
            return;
        }

        if (!regexNumero.test(numero)) {
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

        if (!regexEstado.test(estado)) {
            toast.error("Por favor, insira um estado válido (ex: SP, RJ).");
            return;
        }

        const objetoAdicionado = {
            nome,
            email,
            cpf: cpfSemMascara,
            celular: celularSemMascara,
            senha,
            cep: cepSemMascara,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        };
        console.log(objetoAdicionado)
        api.post('', {
            nome,
            email,
            cpf,
            celular,
            senha,
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado
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
                        celular={celular}
                        setCelular={setCelular}
                        senha={senha}
                        setSenha={setSenha}
                        confirmarSenha={confirmarSenha}
                        setConfirmarSenha={setConfirmarSenha}
                        avancarEtapa={avancarEtapa}
                    />
                )}
                {etapa === 2 && (
                    <CadastroEndereco
                        cep={cep}
                        setCep={setCep}
                        rua={rua}
                        setRua={setRua}
                        numero={numero}
                        setNumero={setNumero}
                        complemento={complemento}
                        setComplemento={setComplemento}
                        bairro={bairro}
                        setBairro={setBairro}
                        cidade={cidade}
                        setCidade={setCidade}
                        estado={estado}
                        setEstado={setEstado}
                        voltarEtapa={voltarEtapa}
                        salvarDados={salvarDados}
                    />
                )}
            </section>
        </main>
    );
}