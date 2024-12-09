import React, { useEffect, useState } from 'react';
import { X, PlusCircle, MinusCircle } from 'phosphor-react';
import styles from './Modal.module.css';

export const Modal = ({ nome }) => {
  const [exibirModal, setExibirModal] = useState(false);
  const [leftSideItems, setLeftSideItems] = useState([
    { name: 'Corte de Cabelo Masculino', mark: 'Barbearia Don Roque', qtd: 15, value: 30.00 },
    { name: 'Corte de Cabelo Feminino', mark: 'Barbearia Don Roque', qtd: 10, value: 40.00 },
    { name: 'Barba Completa', mark: 'Barbearia Don Roque', qtd: 20, value: 25.00 },
    { name: 'Corte de Cabelo Infantil', mark: 'Barbearia Don Roque', qtd: 8, value: 25.00 },
    { name: 'Tratamento para Cabelos', mark: 'Barbearia Don Roque', qtd: 12, value: 50.00 },
    { name: 'Sobrancelha', mark: 'Barbearia Don Roque', qtd: 18, value: 15.00 },
    { name: 'Pacote de Cortes (5 cortes)', mark: 'Barbearia Don Roque', qtd: 5, value: 130.00 },
    { name: 'Shampoo Profissional', mark: 'Barbearia Don Roque', qtd: 30, value: 25.00 },
    { name: 'Creme para Barba', mark: 'Barbearia Don Roque', qtd: 25, value: 18.00 },
    { name: 'Corte e Barba', mark: 'Barbearia Don Roque', qtd: 10, value: 45.00 },
    { name: 'Corte e Sobrancelha', mark: 'Barbearia Don Roque', qtd: 7, value: 40.00 },
    { name: 'Hidratação Profunda para Cabelos', mark: 'Barbearia Don Roque', qtd: 6, value: 60.00 },
    { name: 'Corte + Tratamento Capilar', mark: 'Barbearia Don Roque', qtd: 9, value: 55.00 },
    { name: 'Escova Progressiva', mark: 'Barbearia Don Roque', qtd: 4, value: 100.00 },
    { name: 'Pacote de Sobrancelha (5 sessões)', mark: 'Barbearia Don Roque', qtd: 3, value: 65.00 }
  ]);
  const [rightSideItems, setRightSideItems] = useState([]);


  function addQtdProduct(name) {
    setLeftSideItems((prevLeftItems) => {
      return prevLeftItems.map((item) => {
        if (item.name === name && item.qtd > 0) { 
          return { ...item, qtd: item.qtd - 1 };
        }
        return item;
      });
    });

    setRightSideItems((prevRightItems) => {
      const itemToAdd = leftSideItems.find((item) => item.name === name); 

      if (itemToAdd) {
        const existingItem = prevRightItems.find((cartItem) => cartItem.name === name);

        if (existingItem) {
          return prevRightItems.map((cartItem) =>
            cartItem.name === name
              ? { ...cartItem, qtd: cartItem.qtd + 1 }
              : cartItem
          );
        } else {
          return [...prevRightItems, { ...itemToAdd, qtd: 1 }];
        }
      }

      return prevRightItems; 
    });
  }

  function removeQtdProduct(name) {
    setRightSideItems((prevRightItems) => {
      const updatedRightSideItems = prevRightItems.map((item) => {
        if (item.name === name && item.qtd > 0) {
          const updatedItem = { ...item, qtd: item.qtd - 1 };

          setRightSideItems(prevRightItems.map((cartItem) =>
            cartItem.name === name
              ? updatedItem
              : cartItem
          ));

          setLeftSideItems((prevLeftItems) =>
            prevLeftItems.map((stockItem) =>
              stockItem.name === name
                ? { ...stockItem, qtd: stockItem.qtd + 1 }
                : stockItem
            )
          );
        }
        return item;
      });

      return updatedRightSideItems;
    });
  }

  function onFecharClick() {
    setExibirModal(false);
  }

  function onFinalizarClick() {
    return;
  }

  function statusAtrasado() { }

  function statusPendente() { }

  function statusConcluido() { }

  //   useEffect(() => {
  //   // Função que usa o método get para buscar os itens
  //   const fetchLeftSideItems = () => {
  //     api.get(`/schedule/${id}`) // Sua requisição, pode adicionar parâmetros conforme necessário
  //       .then((response) => {
  //         setLeftSideItems(response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Erro ao buscar itens:', error);
  //       });
  //   };

  //   fetchLeftSideItems();
  // }, []);

  return (
    <>
      {exibirModal ? (
        <div className={styles.modal}>
          <p onClick={onFecharClick} className={styles.fechar}><X size={32} /></p>
          <div className={styles['header-modal']}>
            <h1>Agenda: {nome}</h1>
          </div>
          <section className={styles['middle-modal']}>
            {/* Lado esquerdo */}
            <div className={styles['left-side']}>
              <div className={styles['header-left-side']}>
                <h1>Produtos do estoque</h1>
              </div>
              <div className={styles['content-left-side']}>
                {leftSideItems.map((item, index) => (
                  <div key={index} className={styles['item-left-side']}>
                    <div className={styles['content-modal-right-side']}>
                      <div className={styles.left}>
                        <p>{item.name}</p> <p>{item.mark}</p>
                      </div>
                      <div className={styles.right}>
                        <p>R$ {item.value.toFixed(2).replace('.', ',')}</p> <p>QTD: {item.qtd}</p>
                      </div>
                    </div>
                    <span className={styles.plus} onClick={() => addQtdProduct(item.name)}>
                      <PlusCircle size={16} weight='fill' />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lado direito */}
            <div className={styles['right-side']}>
              <div className={styles['header-right-side']}>
                <h1>Produtos do agendamento</h1>
              </div>
              <div className={styles['content-right-side']}>
                {rightSideItems
                  .filter((item) => item.qtd > 0)
                  .map((item, index) => (
                    <div key={index} className={styles['item-right-side']}>
                      <span className={styles.minus} onClick={() => removeQtdProduct(item.name)}>
                        <MinusCircle size={16} weight='fill' />
                      </span>
                      <div className={styles['content-modal-right-side']}>
                        <div className={styles.left}>
                          <p>{item.name}</p> <p>{item.mark}</p>
                        </div>
                        <div className={styles.right}>
                          <p>R$ {item.value.toFixed(2).replace('.', ',')}</p> <p>QTD: {item.qtd}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          <div className={styles.status}>
            <button onClick={statusAtrasado} style={{ color: 'red' }}>Atrasado</button>
            <button onClick={statusPendente} style={{ color: 'yellow' }}>Pendente</button>
            <button onClick={statusConcluido} style={{ color: 'var(--green-400)' }}>Concluído</button>
          </div>
          <div className={styles['button-modal']}>
            <button onClick={onFinalizarClick}>Finalizar</button>
          </div>
        </div>
      ) : null}
    </>
  );
};
