import '../../global.css';
import styles from './Perfil.module.css'
import CampoTexto from "../../components/CampoTexto/CampoTexto";
import { inputNumerosDecimais, mascaraCEP, mascaraCelular } from '../../utils/global'
import Botao from '../../components/Botao/Botao';


export const PerfilReadOnly = ({
    nome, setNome,
    email, setEmail,
    cellphone, setCellphone,
    dataNasc, setDataNasc,
    cep, setCep,
    logradouro, setLogradouro,
    number, setNumber,
    complemento, setComplemento,
    bairro, setBairro,
    cidade, setCidade,
    uf, setUf,
    readOnly, setReadOnly,
}) => {
    return (
        <div className={styles['left-side']}>
            <h1>Informações da conta</h1>
            <section className={styles.informacoes}>

                {/* LADO ESQUERDO */}
                <div className={styles.left}>
                    <CampoTexto
                        tipo='text'
                        valor={nome}
                        aoAlterado={setNome}
                        readOnly={readOnly}
                        obrigatorio={true}
                        label="Nome Completo"
                        maxLength="70"
                        labelClassName={styles.customLabel}
                        className={styles.inputReadOnly}
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
                        className={styles.inputReadOnly}
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
                        className={styles.inputReadOnly}
                    />
                    <CampoTexto
                        tipo='date'
                        valor={dataNasc}
                        aoAlterado={setDataNasc}
                        readOnly={readOnly}
                        onInput={mascaraCelular}
                        obrigatorio={true}
                        label="Data de nascimento"
                        maxLength="14"
                        labelClassName={styles.customLabel}
                        className={styles.inputReadOnly}
                    />
                </div>

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
                        className={styles.inputReadOnly}
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
                            className={styles.inputReadOnly}
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
                            className={styles.inputReadOnly}
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
                            className={styles.inputReadOnly}
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
                        className={styles.inputReadOnly}
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
                            className={styles.inputReadOnly}
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
                            className={styles.inputReadOnly}
                        />
                    </div>
                    <div className={styles.botoes}>
                        <Botao
                            onClick={() => setReadOnly(false)}
                            corFundo="red"
                            corTexto="white"
                            tamanho="size100"
                            texto="EDITAR"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}