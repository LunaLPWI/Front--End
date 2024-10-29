// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto
const UserContext = createContext();

// Provedor de contexto para encapsular o estado e fornecer funções de atualização
export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const dataString = sessionStorage.getItem('user');
    return dataString ? JSON.parse(dataString) : {
      nome: '',
      email: '',
      cellphone: '',
      address: {
        uf: '',
        cidade: '',
        cep: '',
        logradouro: '',
        bairro: '',
        number: '',
        complemento: '',
      },
    };
  });

  // Atualiza o sessionStorage toda vez que o usuário é alterado
  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

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
