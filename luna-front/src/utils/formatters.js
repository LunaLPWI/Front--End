export const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const formatAmount = (value) => {
    const digits = value.replace(/\D/g, '');
    return (parseInt(digits || '0') / 100).toFixed(2);
};
