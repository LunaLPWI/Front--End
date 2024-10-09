import { useEffect } from 'react';
import '../../global.css';
import { loadMercadoPago } from "@mercadopago/sdk-js";

const FormularioPagamento = () => {
    useEffect(() => {
        const initMercadoPago = async () => {
            await loadMercadoPago();
            const mp = new window.MercadoPago("TEST-ee016bc2-a5f3-4e81-83fb-de053a0b2c4a");

            const cardForm = mp.cardForm({
                amount: "100.5",
                iframe: true,
                form: {
                    id: "form-checkout",
                    cardNumber: {
                        id: "form-checkout__cardNumber",
                        placeholder: "Número do cartão",
                    },
                    expirationDate: {
                        id: "form-checkout__expirationDate",
                        placeholder: "MM/YY",
                    },
                    securityCode: {
                        id: "form-checkout__securityCode",
                        placeholder: "Código de segurança",
                    },
                    cardholderName: {
                        id: "form-checkout__cardholderName",
                        placeholder: "Titular do cartão",
                    },
                    issuer: {
                        id: "form-checkout__issuer",
                        placeholder: "Banco emissor",
                    },
                    installments: {
                        id: "form-checkout__installments",
                        placeholder: "Parcelas",
                    },
                    identificationType: {
                        id: "form-checkout__identificationType",
                        placeholder: "Tipo de documento",
                    },
                    identificationNumber: {
                        id: "form-checkout__identificationNumber",
                        placeholder: "Número do documento",
                    },
                    cardholderEmail: {
                        id: "form-checkout__cardholderEmail",
                        placeholder: "E-mail",
                    },
                },
                callbacks: {
                    onFormMounted: error => {
                        if (error) return console.warn("Form Mounted handling error: ", error);
                        console.log("Form mounted");
                    },
                    onSubmit: event => {
                        event.preventDefault();
                        const {
                            paymentMethodId: payment_method_id,
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType,
                        } = cardForm.getCardFormData();

                        // Mudando a URL para a porta 8081
                        fetch("http://127.0.0.1:8081/preapproval", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                token,
                                issuer_id,
                                payment_method_id,
                                transaction_amount: Number(amount),
                                installments: Number(installments),
                                description: "Descrição do produto",
                                payer: {
                                    email,
                                    identification: {
                                        type: identificationType,
                                        number: identificationNumber,
                                    },
                                },
                            }),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro na requisição: ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Pagamento processado com sucesso:', data);
                        })
                        .catch(error => {
                            console.error('Erro ao processar pagamento:', error);
                        });
                    },
                    onFetching: (resource) => {
                        console.log("Fetching resource: ", resource);
                        const progressBar = document.querySelector(".progress-bar");
                        progressBar.removeAttribute("value");

                        return () => {
                            progressBar.setAttribute("value", "0");
                        };
                    }
                },
            });
        };
        initMercadoPago();
    }, []);

    return (
        <>
            <style>{`
                #form-checkout {
                    display: flex;
                    flex-direction: column;
                    max-width: 600px;
                }

                .container {
                    height: 18px;
                    display: inline-block;
                    border: 1px solid rgb(118, 118, 118);
                    border-radius: 2px;
                    padding: 1px 2px;
                }
            `}</style>
            <form id="form-checkout">
                <span>5031 4332 1540 6351</span>
                <div id="form-checkout__cardNumber" className="container"></div>
                <span>11/25</span>
                <div id="form-checkout__expirationDate" className="container"></div>
                <span>123</span>
                <div id="form-checkout__securityCode" className="container"></div>
                <input type="text" id="form-checkout__cardholderName" />
                <select id="form-checkout__issuer"></select>
                <select id="form-checkout__installments"></select>
                <select id="form-checkout__identificationType"></select>
                <span>12345678909</span>
                <input type="text" id="form-checkout__identificationNumber" />
                <span>arthur.pedroso@sptech.school</span>
                <input type="email" id="form-checkout__cardholderEmail" />

                <button type="submit" id="form-checkout__submit">Pagar</button>
                <progress value="0" className="progress-bar">Carregando...</progress>
            </form>
        </>
    );
}

export default FormularioPagamento;
