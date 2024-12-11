import React, { useState } from 'react';
import { X, PlusCircle, MinusCircle } from 'phosphor-react';
import styles from './Modal.module.css';

export const Modal = ({ nome }) => {
  const [exibirModal, setExibirModal] = useState(false);
  const [leftSideItems, setLeftSideItems] = useState([
    { name: 'Corte de Cabelo Masculino', mark: 'Barbearia Don Roque', qtd: 15, value: 30.00 },
    { name: 'Corte de Cabelo Feminino', mark: 'Barbearia Don Roque', qtd: 10, value: 40.00 },
    { name: 'Barba Completa', mark: 'Barbearia Don Roque', qtd: 20, value: 25.00 },
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
          return updatedItem;
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

  return (
    <>
      <button onClick={() => setExibirModal(true)}>Abrir Modal</button> {/* Botão para abrir a modal */}
      
      {exibirModal ? (
        <div className={styles.modal}>
          <p onClick={onFecharClick} className={styles.fechar}><X size={32} /></p>
          <div className={styles['header-modal']}>
            <h1>Agenda: {nome}</h1>
          </div>
          <section className={styles['middle-modal']}>
            <div className={styles['left-side']}>
              <h1>Produtos do estoque</h1>
              {leftSideItems.map((item, index) => (
                <div key={index}>
                  <p>{item.name}</p>
                  <p>{item.mark}</p>
                  <p>R$ {item.value.toFixed(2)}</p>
                  <p>QTD: {item.qtd}</p>
                  <PlusCircle size={16} weight="fill" onClick={() => addQtdProduct(item.name)} />
                </div>
              ))}
            </div>

            <div className={styles['right-side']}>
              <h1>Produtos do agendamento</h1>
              {rightSideItems.map((item, index) => (
                <div key={index}>
                  <p>{item.name}</p>
                  <p>{item.mark}</p>
                  <p>R$ {item.value.toFixed(2)}</p>
                  <p>QTD: {item.qtd}</p>
                  <MinusCircle size={16} weight="fill" onClick={() => removeQtdProduct(item.name)} />
                </div>
              ))}
            </div>
          </section>
          <button onClick={onFinalizarClick}>Finalizar</button>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
