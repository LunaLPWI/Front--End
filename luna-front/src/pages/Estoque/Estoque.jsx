import styles from './Estoque.module.css'
import Header from '../../components/Header/Header';
import { useUser } from '../../context/userContext';
import CampoTexto from '../../components/CampoTexto/CampoTexto'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardEstoque } from '../../components/CardEstoque/CardEstoque';
import { PlusCircle, ArrowsClockwise, ArrowLeft, ArrowRight } from "phosphor-react";
import bebidasEstoque from '/src/assets/refrigerantes.png';
import cabeloEstoque from '/src/assets/cabelo-masculino-curto.png';
import facialEstoque from '/src/assets/facial-estoque.png';
import barbaEstoque from '/src/assets/barba-estoque.png';


export const Estoque = () => {

  const navigate = useNavigate();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState([]);
  // if (user.role == 'ROLE_ADMIN') setIsAdmin(true)

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [qtd, setQtd] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/Error');
    }
  }, [isAdmin, navigate]);

  const links = [
    { name: 'DASHBOARD', path: '/dashboard' },
    { name: 'CLIENTES', path: '/agenda-clientes' },
    { name: 'AGENDAS', path: '' },
    { name: 'ESTOQUE', path: '/estoque' }
    // { name: 'PERFIL', path: '/perfil' }
  ]

  const handleLogoutClick = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const categorias = [
    { id: 1, imagem: bebidasEstoque, label: 'Bebidas' },
    { id: 2, imagem: cabeloEstoque, label: 'Cabelo' },
    { id: 3, imagem: facialEstoque, label: 'Facial' },
    { id: 4, imagem: barbaEstoque, label: 'Barba' }
  ];

  const [infos, setInfos] = useState([
    {
      id: 1,
      detalhes: [
        { title: 'teste', marca: 'Gillette', Estoque: '20', valor: 'R$ 30,00' },
        { title: 'teste', marca: 'Bic', Estoque: '15', valor: 'R$ 25,00' },
        { title: 'teste', marca: 'Barba Forte', Estoque: '10', valor: 'R$ 50,00' }
      ]
    },
    {
      id: 2,
      detalhes: [
        { title: 'Gel cera hidratante', marca: 'Philips', Estoque: '5', valor: 'R$ 300,00' },
        { title: 'Gel Perry Lohan', marca: 'Wahl', Estoque: '8', valor: 'R$ 400,00' },
        { title: 'Shampoo 3 em 1', marca: 'Oster', Estoque: '6', valor: 'R$ 350,00' },
        { title: 'Massageador de careca', marca: 'Panasonic', Estoque: '4', valor: 'R$ 500,00' }
      ]
    },
    {
      id: 3,
      detalhes: [
        { title: 'teste', marca: '3 Corações', Estoque: '30', valor: 'R$ 15,00' },
        { title: 'teste', marca: 'Cafeína', Estoque: '20', valor: 'R$ 20,00' }
      ]
    },
    {
      id: 4,
      detalhes: [
        { title: 'teste', marca: 'Proraso', Estoque: '10', valor: 'R$ 60,00' },
        { title: 'teste', marca: 'Barbearia Brasil', Estoque: '12', valor: 'R$ 45,00' },
        { title: 'teste', marca: 'Clubman', Estoque: '8', valor: 'R$ 70,00' },
        { title: 'teste', marca: 'Bozzano', Estoque: '15', valor: 'R$ 40,00' },
        { title: 'teste', marca: 'L’Oréal Men', Estoque: '5', valor: 'R$ 90,00' }
      ]
    }
  ]);

  const handleAdd = () => {

  }

  const handleBack = () => {
    setAddProduct(false)
  }
  const handleAddProduct = () => {
    setAddProduct(true)
  }

  const handleReload = async () => {
    const updatedInfos = await fetchDataFromApi();
    setInfos(updatedInfos);
  };

  const handleCardClick = (id) => {
    setAddProduct(false);
    setSelectedCard(id);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={styles['container-estoque']}>
      <Header
        links={links}
        showButton={true}
        buttonText="SAIR"
        onButtonClick={handleLogoutClick}
      />
      <main>
        <section>
          <div className={styles['left-side']}>
            {categorias.map((categoria) => (
              <div key={categoria.id}>
                <CardEstoque
                  imagem={categoria.imagem}
                  label={categoria.label}
                  onClick={() => handleCardClick(categoria.id)}
                  isSelected={selectedCard === categoria.id}
                />
              </div>
            ))}
          </div>
          <div className={styles['right-side']}>
            <div className={styles['info-categoria']}>
              {addProduct ? (
                <div className={styles['new-product']}>
                  <section>
                    <h1>Adicionar produto</h1>
                    <div className={styles.adicionar}>
                      <div className={styles.conteudo}>
                        <div className={styles['conteudo-esquerdo']}>
                          <label>
                            <p>Nome do produto:</p>
                            <input
                              type="text"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                            />
                          </label>
                          <label>
                            <p>Marca:</p>
                            <input
                              type="text"
                              value={marca}
                              onChange={(e) => setMarca(e.target.value)}
                            />
                          </label>
                        </div>
                        <hr style={{ border: '1px solid red', height: '165px', display: 'flex', alignSelf: 'center' }} />
                        <div className={styles['conteudo-direito']}>
                          <label>
                            <p>Quantidade:</p>
                            <input
                              type="text"
                              value={qtd}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setQtd(value);
                                }
                              }}
                            />
                          </label>
                          <label>
                            <p>Valor:</p>
                            <input
                              type="text"
                              value={valor}
                              onChange={(e) => setValor(e.target.value)}
                            />
                          </label>

                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles['content-categoria']}>
                  {infos.map((info) =>
                    selectedCard === info.id && (
                      <div key={info.id}>
                        {info.detalhes.map((detalhe, index) => (
                          <div key={index} className={styles['textos-categoria']}>
                            <div className={styles.left}>
                              <h1>
                                <strong>{detalhe.title}</strong>
                              </h1>
                              <p>Marca: {detalhe.marca}</p>
                            </div>
                            <div className={styles.right}>
                              <p>Estoque: {detalhe.Estoque}</p>
                              <p>Valor: {detalhe.valor}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
              <div className={styles.botoes}>
                {selectedCard !== null ? (
                  addProduct ? (
                    <>
                      <button
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', cursor: 'default' }}
                      >
                        <ArrowLeft
                          size={32}
                          color="red"
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                        <span style={{ cursor: 'pointer' }}>Voltar</span>
                      </button>
                      <button
                        onClick={handleAdd}
                        style={{ background: 'none', border: 'none' }}
                      >
                        <span style={{ cursor: 'pointer' }}>Adicionar</span>
                        <ArrowRight
                          size={32}
                          color="red"
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleAddProduct}>
                        <PlusCircle
                          size={32}
                          color="red"
                          style={{ marginRight: '10px' }}
                        />
                        Adicionar produto
                      </button>
                      <button onClick={handleReload}>
                        <ArrowsClockwise
                          size={32}
                          color="red"
                          style={{ marginRight: '10px' }}
                        />
                        Atualizar
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <button onClick={handleAddProduct}>
                      <PlusCircle
                        size={32}
                        color="red"
                        style={{ marginRight: '10px' }}
                      />
                      Adicionar produto
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};