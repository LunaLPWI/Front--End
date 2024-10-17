import React from 'react';

const Botao = ({ corFundo, corTexto, tamanho, texto, onClick, tipo = "button" }) => {
    const getTamanho = (tamanho) => {
        switch (tamanho) {
            case 'size100':
                return {
                    padding: '10px',
                    fontSize: '14px',
                    border: '2px solid #ff0000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '2%',
                    width: '140px',
                    textAlign: 'center'
                };
            case 'size200':
                return {
                    padding: '15px',
                    fontSize: '16px',
                    border: '2px solid #ff0000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '2%',
                    width: '140px',
                    textAlign: 'center'
                };
            case 'size300':
                return {
                    padding: '20px',
                    fontSize: '18px',
                    border: '2px solid #ff0000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '2%',
                    width: '140px',
                    textAlign: 'center'
                };
            default:
                return {
                    padding: '10px',
                    fontSize: '14px',
                    border: '2px solid #ff0000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '2%',
                    width: '140px',
                    textAlign: 'center'
                };
        }
    };

    const estilo = getTamanho(tamanho);

    return (
        <button
            type={tipo}
            onClick={onClick}
            style={{
                backgroundColor: corFundo,
                color: corTexto,
                padding: estilo.padding,
                fontSize: estilo.fontSize,
                border: estilo.border,
                borderRadius: estilo.borderRadius,
                cursor: estilo.cursor,
                margin: estilo.margin,
                width: estilo.width,
                textAlign: estilo.textAlign
            }}
        >
            {texto}
        </button>
    );
};

export default Botao;
