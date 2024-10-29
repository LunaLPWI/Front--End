import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/Botao/Botao";
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import styles from "./Login.module.css";
import { toast } from 'react-toastify';
import { api } from '../../api';
import { ArrowLeft } from "phosphor-react";
import { useUser } from "../../context/userContext";

function Login() {

    const { setUser } = useUser();

    const navigate = useNavigate();

    const [email, setEmail] = useState('teste@gmail.com')
    const [senha, setSenha] = useState('teste1@teste')

    //==================================================================================================

    //**LÓGICA DO LOGIN**
    const entrar = (e) => {
        e.preventDefault()
        
        if (email === '' || senha === '') {
            toast.error('Preencha todos os campos')
            return
        }

        const params = {
            email: email,
            password: senha
        }

        api.post('/clients/login', params)
            .then((response) => {
                if (response.status === 200) {
                    const userData = response.data;
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    if(userData.isAdmin === true){
                        toast.success('Login realizado com sucesso',{
                            autoClose: 2000,
                            closeOnClick: true
                        });
                        navigate('/perfil')
                    } else if(userData.isFuncionario === true && userData.isAdmin === false){
                        toast.success('Login realizado com sucesso',{
                            autoClose: 2000,
                            closeOnClick: true
                        });
                        navigate('/agenda-clientes')
                    } else {
                        toast.success('Login realizado com sucesso',{
                            autoClose: 2000,
                            closeOnClick: true
                        });
                        navigate('/perfil');
                    }
                } else {
                    toast.error('Email ou senha inválidos',{
                        autoClose: 2000,
                        closeOnClick: true
                    });
                }
            }).catch(() => {
                toast.error('Erro ao fazer login. Por favor, tente novamente.',{
                    autoClose: 2000,
                    closeOnClick: true
                });
            });

    }
    //**LÓGICA DO LOGIN**

    //==================================================================================================

    const handleBackHome = () => { navigate('/') }

    //==================================================================================================

    return (
        <main className={styles['main-login']}>
            <section className={styles['section-login']}>
                <section className={styles['formulario-login']}>
                    <div
                        className={styles.setinha}
                        onClick={handleBackHome}><ArrowLeft size={32} color="#ff0000" weight="regular" />
                    </div>
                    <form className={styles['form-login']}>
                        <h1 className={styles['h1-login']}>LOGIN</h1>
                        <div className={styles.inputs}>

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

                            {/* // REDEFINIR SENHA */}
                            <a href='/redefinir-senha' className={styles['redefinir-senha']}>esqueci a senha</a>
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