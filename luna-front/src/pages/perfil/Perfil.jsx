import '../../global.css';
import Header from '../../components/Header/Header';
import styles from './Perfil.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { limparMascara, mascaraCEPString, mascaraCelularString } from '../../utils/global'
import Botao from '../../components/Botao/Botao';
import { toast } from 'react-toastify';
import { PerfilEdit } from './PerfilEdit';
import { PerfilReadOnly } from './PerfilReadOnly';
import { useUser } from '../../context/userContext';

function Perfil() {

  const { user } = useUser(); 
  const navigate = useNavigate();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cellphone, setCellphone] = useState(user?.cellphone || '');

  const [uf, setUf] = useState(user?.address?.uf || '');
  const [cidade, setCidade] = useState(user?.address?.cidade || '');
  const [cep, setCep] = useState(user?.address?.cep || '');
  const [logradouro, setLogradouro] = useState(user?.address?.logradouro || '');
  const [bairro, setBairro] = useState(user?.address?.bairro || '');
  const [number, setNumber] = useState(user?.address?.number || '');
  const [complemento, setComplemento] = useState(user?.address?.complemento || '');

  useEffect(() => {
    setNome(user?.nome || '');
    setEmail(user?.email || '');
    setCellphone(user?.cellphone || '');
    setUf(user?.address?.uf || '');
    setCidade(user?.address?.cidade || '');
    setCep(user?.address?.cep || '');
    setLogradouro(user?.address?.logradouro || '');
    setBairro(user?.address?.bairro || '');
    setNumber(user?.address?.number || '');
    setComplemento(user?.address?.complemento || '');
  }, [user]); 

  
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    setCep(mascaraCEPString(cep))
    setCellphone(mascaraCelularString(cellphone))
  }, [user.address.cep], [user.cellphone])

  const links = [
    { name: 'PLANOS', path: '/planos' },
    { name: 'PERFIL', path: '/perfil' },
    { name: 'AGENDAR', path: '/agendamentos' },
    { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
  ];

  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleChangeInfomations = async () => {
    const celularSemMascara = limparMascara(cellphone);
    const cepSemMascara = limparMascara(cep);

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepSemMascara}/json/`);
      const dadosCep = await resposta.json();

      if (dadosCep.erro) {
        throw new Error("O CEP informado não existe. Por favor, verifique e tente novamente.");
      }

      const valoresAtualizados = {
        nome,
        email,
        cellphone: celularSemMascara,
        address: {
          cep: cepSemMascara,
          logradouro: dadosCep.logradouro || logradouro,
          complemento: dadosCep.complemento || complemento,
          cidade: dadosCep.localidade || cidade,
          bairro: dadosCep.bairro || bairro,
          uf: dadosCep.uf || uf,
          number
        }
      };
       console.log("Valores atualizados: ",valoresAtualizados)
      toast.success("Dados atualizados",{
        autoClose: 2000,
        closeOnClick: true
      })
      setReadOnly(true);

    } catch (error) {
      toast.error("CEP não existe", {
        autoClose: 2000,
        closeOnClick: true
      })
    }
  };


  const plano = "Corte e Barba"
  const vencimento = "12/12/2012"
  return (
    <div className={styles['body-perfil']}>
      <Header
        links={links}
        showButton={true}
        buttonText="SAIR"
        onButtonClick={handleLogoutClick}
      />
      <main className={styles['main-perfil']}>
        <div className={styles.img}><img src="" alt="" /></div>
        <section>
          {/* LADO ESQUERDO CONTAINER */}
          {readOnly ? (
            <PerfilReadOnly
              nome={nome}
              setNome={setNome}
              email={email}
              setEmail={setEmail}
              cellphone={cellphone}
              setCellphone={setCellphone}
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
              readOnly={readOnly}
              setReadOnly={setReadOnly}
            />
          ) : (
            <PerfilEdit
              nome={nome}
              setNome={setNome}
              email={email}
              setEmail={setEmail}
              cellphone={cellphone}
              setCellphone={setCellphone}
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
              readOnly={readOnly}
              setReadOnly={setReadOnly}
              handleChangeInfomations={handleChangeInfomations}
            />
          )}
          {/* LADO ESQUERDO CONTAINER */}

          {/* ============================================= */}

          {/* LADO DIREITO CONTAINER */}
          <div className={styles['right-side']}>
            <h1>Plano</h1>
            <section className={styles.plano}>
              <div className={styles.container}>
                <h2>Seu plano: <span>{plano}</span></h2>
                <h2>Vencimento: <span>{vencimento}</span></h2>
                <div className={styles['botao-plano']}>
                  <Botao
                    onClick={() => navigate('/planos')}
                    corFundo="red"
                    corTexto="white"
                    tamanho="size100"
                    texto="Alterar plano"
                  />
                </div>
              </div>
            </section>
          </div>
          {/* LADO DIREITO CONTAINER */}
        </section>
      </main>
    </div>
  );
}

export default Perfil;