import axios from 'axios';
import '../../global.css';
import styles from './Perfil.module.css'
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import { inputNumerosDecimais, mascaraCEP, mascaraCelular } from '../../utils/global'
import Botao from '../../components/Botao/Botao';
import { useEffect } from 'react';

export const PerfilEdit = ({
  nome, setNome,
  email, setEmail,
  cellphone, setCellphone,
  cep, setCep,
  logradouro, setLogradouro,
  number, setNumber,
  complemento, setComplemento,
  bairro, setBairro,
  cidade, setCidade,
  uf, setUf,
  readOnly, setReadOnly,
  handleChangeInfomations
}) => {

  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = response.data;

      if (dados.erro) {
        toast.error("CEP não encontrado.");
      } else {
        setLogradouro(dados.logradouro || '');
        setBairro(dados.bairro || '');
        setCidade(dados.localidade || '');
        setUf(dados.uf || '');
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      buscarEndereco(cepLimpo);
    }
  }, [cep]);
  return (
    <div className={styles['left-side']}>
      <h1>Editando
        <div className={styles.loading}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </h1>
      <section className={styles.informacoes}>
        {/* LADO ESQUERDO */}
        <div className={styles.left}><CampoTexto
          tipo='text'
          valor={nome}
          aoAlterado={setNome}
          readOnly={readOnly}
          obrigatorio={true}
          label="Nome Completo"
          maxLength="70"
          labelClassName={styles.customLabel}
          className={styles.customInput}
        />
          <CampoTexto
            tipo='text'
            valor={email}
            aoAlterado={setEmail}
            readOnly={readOnly}
            obrigatorio={true}
            label="Email"
            maxLength="70"
            labelClassName={styles.customLabel}
            className={styles.customInput}
          />
          <CampoTexto
            tipo='text'
            valor={cellphone}
            aoAlterado={setCellphone}
            readOnly={readOnly}
            onInput={mascaraCelular}
            obrigatorio={true}
            label="Celular"
            maxLength="14"
            labelClassName={styles.customLabel}
            className={styles.customInput}
          /></div>

        {/* LADO ESQUERDO */}

        {/* //========================================================= */}

        {/* LADO DIREITO */}
        <div className={styles.right}>
          <div style={{ display: 'flex' }}><CampoTexto
            tipo='text'
            valor={uf}
            aoAlterado={setUf}
            readOnly={true}
            obrigatorio={true}
            label="Estado"
            maxLength="70"
            labelClassName={styles.customLabel}
            divStyle={{ width: '50%' }}
            inputStyle={{
              height: '40px',
              borderBottom: '1px solid var(--red)',
              background: 'transparent',
              fontSize: '0.98em',
              color: '#d0d0d0',
              padding: '5% 2%',
              cursor: 'default'
            }}
          />
            <CampoTexto
              tipo='text'
              valor={cidade}
              aoAlterado={setCidade}
              readOnly={true}
              obrigatorio={true}
              label="Cidade"
              maxLength="70"
              labelClassName={styles.customLabel}
              divStyle={{ width: '50%' }}
              inputStyle={{
                height: '40px',
                borderBottom: '1px solid var(--red)',
                background: 'transparent',
                fontSize: '0.98em',
                color: '#d0d0d0',
                padding: '5% 2%',
                cursor: 'default'
              }}
            /></div>

          <div style={{ display: 'flex' }}>
            <CampoTexto
              tipo='text'
              valor={cep}
              aoAlterado={setCep}
              readOnly={readOnly}
              onInput={mascaraCEP}
              obrigatorio={true}
              label="CEP"
              maxLength="9"
              labelClassName={styles.customLabel}
              divStyle={{ width: '30%' }}
              inputStyle={{
                height: '40px',
                border: '1px solid var(--red)',
                borderRadius: '5px',
                fontSize: '0.98em',
                color: 'var(--black)',
                padding: '5% 4%'
              }}
            />
            <CampoTexto
              tipo='text'
              valor={logradouro}
              aoAlterado={setLogradouro}
              readOnly={true}
              obrigatorio={true}
              label="Logradouro"
              maxLength="70"
              labelClassName={styles.customLabel}
              divStyle={{ width: '70%' }}
              inputStyle={{
                height: '40px',
                borderBottom: '1px solid var(--red)',
                background: 'transparent',
                fontSize: '0.98em',
                color: '#d0d0d0',
                padding: '5% 2%',
                cursor: 'default'
              }}
            />
          </div>
          <CampoTexto
            tipo='text'
            valor={bairro}
            aoAlterado={setBairro}
            readOnly={true}
            obrigatorio={true}
            label="Bairro"
            maxLength="70"
            labelClassName={styles.customLabel}
            inputStyle={{
              height: '40px',
              borderBottom: '1px solid var(--red)',
              background: 'transparent',
              fontSize: '0.98em',
              color: '#d0d0d0',
              padding: '5% 2%',
              cursor: 'default'
            }}
          />
          <div style={{ display: 'flex' }}>
            <CampoTexto
              tipo='text'
              valor={number}
              aoAlterado={setNumber}
              readOnly={readOnly}
              obrigatorio={true}
              onInput={inputNumerosDecimais}
              label="Número"
              maxLength="70"
              labelClassName={styles.customLabel}
              divStyle={{ width: '30%' }}
              inputStyle={{
                height: '40px',
                border: '1px solid var(--red)',
                borderRadius: '5px',
                fontSize: '0.98em',
                color: 'var(--black)',
                padding: '5% 4%'
              }}
            />
            <CampoTexto
              tipo='text'
              valor={complemento}
              aoAlterado={setComplemento}
              readOnly={readOnly}
              obrigatorio={true}
              label="Complemento"
              maxLength="70"
              labelClassName={styles.customLabel}
              divStyle={{ width: '70%' }}
              inputStyle={{
                height: '40px',
                border: '1px solid var(--red)',
                borderRadius: '5px',
                fontSize: '0.98em',
                color: 'var(--black)',
                padding: '5% 2%'
              }}
            />
          </div>
          <div className={styles.botoes}>
            <>
              <Botao
                onClick={() => setReadOnly(true)}
                corFundo="white"
                corTexto="red"
                tamanho="size100"
                texto="CANCELAR"
              />
              <Botao
                onClick={handleChangeInfomations}
                corFundo="red"
                corTexto="white"
                tamanho="size100"
                texto="SALVAR"
              />
            </>
          </div>
        </div>
      </section>
    </div>
  )
}