export class PaymentService {
    static async getPaymentToken(cardData) {
        // Simulação da chamada à API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    payment_token: `tok_${Math.random().toString(36).substr(2, 9)}`,
                    card_mask: `****${cardData.number.slice(-4)}`
                });
            }, 1000);
        });
    }

    static async getInstallments(amount, brand) {
        // Simulação da chamada à API
        return new Promise((resolve) => {
            setTimeout(() => {
                const installments = Array.from({ length: 12 }, (_, i) => {
                    const installment = i + 1;
                    return {
                        installment,
                        amount,
                        installment_amount: amount / installment,
                        total: amount // Sem juros neste exemplo
                    };
                });

                resolve({
                    installments,
                    brand
                });
            }, 1000);
        });
    }
}
