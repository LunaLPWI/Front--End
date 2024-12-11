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
  const [editingProductId, setEditingProductId] = useState(null);


  useEffect(() => {
    if (user.roles.includes('ROLE_ADMIN')) {
      setIsAdmin(true);
    }
  }, [user.roles]);

  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [qtd, setQtd] = useState('');
  const [valor, setValor] = useState('');
  const [qtdAtualizada, setQtdAtualizada] = useState('');
  const [valorAtualizado, setValorAtualizado] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/Error');
    }
  }, [isAdmin]);

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

  const loadProducts = async () => {
    try {
      const response = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setInfos(response.data);
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

  const handleUpdate = (productId) => {
    const updatedPrice = parseFloat(valorAtualizado);
    const updatedQuantity = parseInt(qtdAtualizada, 10);

    // Verifica se há valores válidos para serem atualizados
    if (isNaN(updatedPrice) && isNaN(updatedQuantity)) {
      toast.error("Insira pelo menos um valor válido para atualizar.", {
        autoClose: 2000,
        closeOnClick: true,
      });
      return;
    }

    // Array de requisições
    const requests = [];

    if (!isNaN(updatedPrice)) {
      requests.push(
        api.put(`/products/change-price`, null, {
          params: { price: updatedPrice, productId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }

    if (!isNaN(updatedQuantity)) {
      requests.push(
        api.put(`/products/change-quantity`, null, {
          params: { qtd: updatedQuantity, productId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }

    // Executa as requisições
    Promise.all(requests)
      .then((responses) => {
        const allSuccessful = responses.every((response) => response.status === 200);

        if (allSuccessful) {
          toast.success("Produto atualizado com sucesso!", {
            autoClose: 2000,
            closeOnClick: true,
          });

          // Atualiza os valores no estado
          setInfos((prevInfos) =>
            prevInfos.map((info) =>
              info.id === productId
                ? {
                  ...info,
                  price: !isNaN(updatedPrice) ? updatedPrice : info.price,
                  amount: !isNaN(updatedQuantity) ? updatedQuantity : info.amount,
                }
                : info
            )
          );

          // Limpa os campos de edição
          setEditingProductId(null);
        }
      })
      .catch((e) => {
        toast.error("Erro ao atualizar produto!", {
          autoClose: 2000,
          closeOnClick: true,
        });
        console.error("Erro ao tentar atualizar", e);
      });
  };





  const handleDelete = (id) => {
    const product = infos.find((p) => p.id === id);
    if (!product) {
      console.error('Produto não encontrado!');
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            toast.success("Produto removido com sucesso!", {
              autoClose: 2000,
              closeOnClick: true,
            });
            setInfos((prevInfos) => prevInfos.filter((info) => info.id !== id));
            setEditingProductId(false);
            setUndoEnable(true);
          }
        })
        .catch((e) => {
          toast.error("Erro ao remover produto", {
            autoClose: 2000,
            closeOnClick: true,
          });
          console.error("Erro ao tentar excluir", e);
        });
    }
  };




  const handleEdit = (productId) => {
    setEditingProductId(productId);
  };

  const handleBack = () => {
    setAddProduct(false)
    setEditingProductId(null)
    setQtdAtualizada('')
    setValorAtualizado('')
  }

  const handleAddProduct = () => {
    setAddProduct(true)
  }

  const handleReload = async () => {
    loadProducts();
  };

  const handleUndo = () => {
    api.put('products/undo', null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Produto adicionado novamente com sucesso!", {
            autoClose: 2000,
            closeOnClick: true,
          });
        }
      })
      .catch((e) => {
        toast.error("Não há produtos para adicionar novamente!", {
          autoClose: 2000,
          closeOnClick: true,
        });
        console.error('Erro na hora de recriar o produto ', e)
      })
  }

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
        <div className={styles.desfazer}><button onClick={() => handleUndo()}>Desfazer deleção</button></div>
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
                      {editingProductId === product.id ? (
                        <>
                          <section>
                            <div className={styles.left}>
                              <h1>
                                <strong>{product.name}</strong>
                              </h1>
                              <p>Marca: {product.mark}</p>
                            </div>
                            <div className={styles.right}>
                              <p>Estoque: <input
                                type="number"
                                value={qtdAtualizada}
                                style={{ width: '70px' }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    setQtdAtualizada(value);
                                  }
                                }}
                              /></p>
                              <p>Valor: <input
                                type="number"
                                step="0.01"
                                value={valorAtualizado}
                                style={{ width: '70px' }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*\.?\d*$/.test(value)) {
                                    setValorAtualizado(value);
                                  }
                                }}
                              /></p>
                            </div>
                          </section>
                          <div className={styles['botoes-card']}>
                            <p className={styles.excluir} onClick={() => handleBack()}>Cancelar</p>
                            <p
                              className={styles.editar}
                              onClick={() => handleUpdate(product.id)}
                            >
                              Confirmar
                            </p>

                          </div>
                        </>
                      ) : (
                        <>
                          <section>
                            <div className={styles.left}>
                              <h1>
                                <strong>{product.name}</strong>
                              </h1>
                              <p>Marca: {product.mark}</p>
                            </div>
                            <div className={styles.right}>
                              <p>Estoque: {product.amount}</p>
                              <p>Valor: R${(product.price.toFixed(2)).replace('.', ',')}</p>
                            </div>
                          </section>
                          <div className={styles['botoes-card']}>
                            <p className={styles.excluir} onClick={() => handleDelete(product.id)}>Excluir produto</p>
                            <p className={styles.editar} onClick={() => handleEdit(product.id)}>Editar produto</p>
                          </div>
                        </>
                      )}
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