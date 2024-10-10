import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./Login.module.css";
import { toast } from 'react-toastify';
import api from '../../api';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const entrar = (e) => {
        e.preventDefault()

        if (email === '' || senha === '') {
            toast.error('Preencha todos os campos')
            return
        } 

        api.post('/login', { email, senha })  // Envia email e senha no corpo da requisição
        .then(response => {
            if (response.status === 200 && response.data.authenticated) {
                // Se login bem-sucedido, redireciona para a home
                toast.success('Login realizado com sucesso');
                navigate('/');
            } else {
                // Se o backend retornar algum erro de validação
                toast.error('Email ou senha inválidos');
            }
        }).catch(error => {
            console.error('Erro ao fazer login:', error);
            toast.error('Erro ao fazer login. Por favor, tente novamente.');
        });

    }

    return (
        <main>
            <section className={styles['section-login']}>
                <section className={styles['formulario-login']}>
                    <form onSubmit={entrar}>
                        <h1>LOGIN</h1>
                        <div className={`${styles.inputs} `}>

                            {/* // EMAIL */}
                            <CampoTexto
                                tipo='email'
                                valor={email}
                                aoAlterado={valor => setEmail(valor)}
                                label="EMAIL"
                                placeholder="exemplo@exemplo.com" />
                            <hr />

                            {/* SENHA */}
                            <CampoTexto
                                tipo='password'
                                valor={senha}
                                aoAlterado={valor => setSenha(valor)}
                                label="SENHA"
                                placeholder="Digite sua senha" />
                        </div>

                        <div className={styles.links}>
                            {/* //VOLTAR HOME */}
                            <a
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate('/home');  
                                }}
                                className={styles['voltar-home']}
                                href="/home"
                            >
                              voltar tela principal
                            </a>

                            {/* // REDEFINIR SENHA */}
                            <a className={styles['redefinir-senha']}>esqueci a senha</a>
                        </div>

                        <div className={styles.botoes}>

                            {/* // CADASTRO */}
                            <Botao
                                onClick={() => navigate('/cadastro')}
                                corFundo="white"
                                corTexto="red"
                                tamanho="size100"
                                texto="CADASTRAR" />

                            {/* // LOGIN */}
                            <Botao
                                onClick={entrar}
                                corFundo="red"
                                corTexto="white"
                                tamanho="size100"
                                texto="LOGIN" />
                        </div>
                    </form>
                </section>
                <div className={styles.imagem}></div>
            </section>
        </main>
    );
}

export default Login