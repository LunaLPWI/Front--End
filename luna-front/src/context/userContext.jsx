// UserContext.js
import React, { createContext, useState, useContext } from 'react';

// Cria o contexto
const UserContext = createContext();

// Provedor de contexto para encapsular o estado e fornecer funções de atualização
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    nome: '',
    email: '',
    celular: '',
    adress: {
      estado: '',
      cidade: '',
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      complemento: '',
    },
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para acessar o contexto
export function useUser() {
  return useContext(UserContext);
}
