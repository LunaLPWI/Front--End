export const limparMascara = (valor) => {
    return valor.replace(/\D/g, '');
};
export const inputSomenteTexto = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ú\s]/g, "");
};
export const inputSomenteNumero = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
};
export const inputSemCaracteresEspeciais = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ú0-9\s]/g,"");
};
export const inputSomenteMinusculas = (e) => {
    e.target.value = e.target.value.replace(/[^a-z\s]/g, "");
};
export const inputSomenteMaiusculas = (e) => {
    e.target.value = e.target.value.replace(/[^A-Z\s]/g, "");
};
export const inputLetrasNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
};
export const inputSemEspacos = (e) => {
    e.target.value = e.target.value.replace(/\s/g, "");
};
export const inputNumerosDecimais = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
};
export const inputNumerosTelefone = (e) => {
    e.target.value = e.target.value.replace(/[^0-9-]/g, "");
};
export const inputNumerosCelular = (e) => {
    e.target.value = e.target.value.replace(/[^0-9()\s-]/g, "");
};
export const mascaraTelefone = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.substring(0, 11);
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
    e.target.value = valor;
};
export const mascaraCelular = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.substring(0, 11);
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
    e.target.value = valor;
};
export const mascaraCPF = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = valor;
};
export const mascaraCEP = (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.substring(0, 8);
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
};

export const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;

    if (cpfLimpo === '00000000000') return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true;
};