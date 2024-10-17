import React, { useState } from 'react';
import { PaymentService } from '../../service/PaymentService';
import { formatCardNumber, formatAmount } from '../../utils/formatters';
import styles from './PaymentComponent.module.css';

const PaymentComponent = () => {
    const [loading, setLoading] = useState(false);
    const [tokenResult, setTokenResult] = useState(null);
    const [installments, setInstallments] = useState(null);
    const [formData, setFormData] = useState({
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: '',
        brand: '',
        amount: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        switch (name) {
            case 'cardNumber':
                formattedValue = formatCardNumber(value);
                break;
            case 'amount':
                formattedValue = formatAmount(value);
                break;
            default:
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTokenResult(null);
        setInstallments(null);

        try {
            const cardData = {
                brand: formData.brand,
                number: formData.cardNumber.replace(/\s/g, ''),
                cvv: formData.cvv,
                expiration_month: formData.expirationMonth,
                expiration_year: formData.expirationYear
            };

            const amount = parseFloat(formData.amount) * 100;

            const tokenResponse = await PaymentService.getPaymentToken(cardData);
            const installmentsResponse = await PaymentService.getInstallments(amount, cardData.brand);

            setTokenResult(tokenResponse);
            setInstallments(installmentsResponse);
        } catch (error) {
            setTokenResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Pagamento com Cartão</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.col}>
                            <div className={styles.formGroup}>
                                <label htmlFor="expirationMonth">Mês</label>
                                <select
                                    id="expirationMonth"
                                    name="expirationMonth"
                                    value={formData.expirationMonth}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Mês</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = (i + 1).toString().padStart(2, '0');
                                        return (
                                            <option key={month} value={month}>
                                                {month}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className={styles.col}>
                            <div className={styles.formGroup}>
                                <label htmlFor="expirationYear">Ano</label>
                                <select
                                    id="expirationYear"
                                    name="expirationYear"
                                    value={formData.expirationYear}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Ano</option>
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const year = (new Date().getFullYear() + i).toString();
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className={styles.col}>
                            <div className={styles.formGroup}>
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    maxLength="4"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="brand">Bandeira</label>
                        <select
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione a bandeira</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                            <option value="elo">Elo</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amount">Valor (R$)</label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0,00"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Processando...' : 'Gerar Token e Consultar Parcelas'}
                    </button>
                </form>

                {loading && <div className={styles.loading}></div>}

                {tokenResult && (
                    <div className={`${styles.result} ${tokenResult.error ? styles.error : styles.success}`}>
                        {tokenResult.error ? (
                            <>Erro: {tokenResult.error}</>
                        ) : (
                            <>
                                Token gerado com sucesso: {tokenResult.payment_token}<br />
                                Cartão: {tokenResult.card_mask}
                            </>
                        )}
                    </div>
                )}

                {installments && (
                    <div className={styles.installmentsContainer}>
                        <h2>Opções de Parcelamento</h2>
                        <table className={styles.installmentsTable}>
                            <thead>
                                <tr>
                                    <th>Parcelas</th>
                                    <th>Valor da Parcela</th>
                                    <th>Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {installments.installments.map((inst) => (
                                    <tr key={inst.installment}>
                                        <td>{inst.installment}x</td>
                                        <td>R$ {(inst.installment_amount/100).toFixed(2)}</td>
                                        <td>R$ {(inst.total/100).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentComponent;