import React from 'react';
import PaymentComponent from '../../components/PaymentComponent/PaymentComponent';
import Header from '../../components/Header/Header';

const PaymentForm = () => {
    const links = [
        { name: 'PLANOS', path: '/planos' },
        { name: 'PERFIL', path: '/perfil' },
        { name: 'AGENDAR', path: '/agendar' },
        { name: 'MEUS AGENDAMENTOS', path: '/meus-agendamentos' }
    ];

    const handleLogoutClick = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div>
            <Header
                links={links}
                showButton={true}
                buttonText="SAIR"
                onButtonClick={handleLogoutClick}
            />
            <PaymentComponent />
        </div>
    );
};

export default PaymentForm;