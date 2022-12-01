/*
    Autor: Lindsay Cerqueira
    Data: 04/04/2017
    Objetivo: Converte um number para o formato currency.
    Ex: 1500.25 --> 1.500,25 ou R$ 1.500,25
*/
Number.prototype.toCurrency = function (comR$) {
    let currency = this.toLocaleString("pt-BR", { minimumFractionDigits: 2, style: "currency", currency: "BRL" });
    return (comR$) ? currency.replace('R$', 'R$ ') : currency.replace('R$', '');
};

