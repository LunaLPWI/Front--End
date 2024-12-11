import styles from './Estoque.module.css'
import Header from '../../components/Header/Header';
import { useUser } from '../../context/userContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardEstoque } from '../../components/CardEstoque/CardEstoque';
import { PlusCircle, ArrowsClockwise, ArrowLeft, ArrowRight } from "phosphor-react";
import bebidasEstoque from '/src/assets/refrigerantes.png';
import cabeloEstoque from '/src/assets/cabelo-masculino-curto.png';
import facialEstoque from '/src/assets/facial-estoque.png';
import barbaEstoque from '/src/assets/barba-estoque.png';
import { toast } from 'react-toastify';
import { api } from '../../api';


export const Estoque = () => {

  const navigate = useNavigate();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    if (user.roles.includes('ROLE_ADMIN')) {
      setIsAdmin(true);
    }
  }, [user.roles]);

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [qtd, setQtd] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/Error');
    }
  }, [isAdmin]);

  const links = [
    { name: 'DASHBOARD', path: '/financeiro' },
    { name: 'CLIENTES', path: '/agenda-clientes' },
    { name: 'GERENCIAMENTO', path: '/gerenciamento-clientes' },
    { name: 'PERFIL', path: '/perfil' }
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

  const loadProducts = async () => {
    try {
      const response = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setInfos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar produtos. Tente novamente.', {
        autoClose: 2000,
        closeOnClick: true
      });
    }
  };

  const getProductsByCategory = (categoryId) => {
    const selectedCategory = categorias.find(categoria => categoria.id === categoryId)?.label;
    return infos.filter((produto) => produto.category === selectedCategory);
  };

  const handleAdd = () => {

    const selectedCategory = categorias.find(
      (categoria) => categoria.id === selectedCard
    )?.label;

    if (!selectedCategory) {
      console.error('Categoria inválida selecionada!');
      return;
    }


    const newProduct = {
      name: nome,
      price: parseFloat(parseFloat(valor.replace(',', '.')).toFixed(2)),
      amount: parseInt(qtd, 10),
      mark: marca,
      category: selectedCategory,
    };

    api.post('/products', newProduct, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Produto adicionado com sucesso!', {
            autoClose: 2000,
            closeOnClick: true,
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao criar produto:', error);
      });
  };



  const handleBack = () => {
    setAddProduct(false)
  }
  const handleAddProduct = () => {
    setAddProduct(true)
  }

  const handleReload = async () => {
    loadProducts();
  };

  const handleCardClick = (id) => {
    setAddProduct(false);
    setSelectedCard(id);
    loadProducts();
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
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, '');
                                if (value.length > 2) {
                                  value = value.slice(0, value.length - 2) + ',' + value.slice(value.length - 2);
                                }
                                setValor(value);
                              }}
                              
                              
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles['content-categoria']}>
                  {getProductsByCategory(selectedCard).map((product, index) => (
                    <div key={index} className={styles['textos-categoria']}>
                      <div className={styles.left}>
                        <h1>
                          <strong>{product.name}</strong>
                        </h1>
                        <p>Marca: {product.mark}</p>
                      </div>
                      <div className={styles.right}>
                        <p>Estoque: {product.amount}</p>
                        <p>Valor: R${(product.price.toFixed(2)).replace('.',',')}</p>
                      </div>
                    </div>
                  ))}
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
                    {/* <button onClick={handleAddProduct}>
                      <PlusCircle
                        size={32}
                        color="red"
                        style={{ marginRight: '10px' }}
                      />
                      Adicionar produto
                    </button> */}
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