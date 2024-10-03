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

    // Adicione este console.log para exibir o token
    console.log("Token do cartão:", token);

    fetch("/process_payment", {
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
    });
},
