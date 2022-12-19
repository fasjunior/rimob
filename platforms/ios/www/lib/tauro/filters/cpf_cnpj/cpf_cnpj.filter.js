angular.module('Tauro').filter('cpf_cnpj', function () {
    return function (input) {
        let str = input + '';
        str = str.replace(/\D/g, '');
        //cpf
        if (str.length === 11) {
            str = str.replace(/(\d{3})(\d)/, "$1.$2");
            str = str.replace(/(\d{3})(\d)/, "$1.$2");
            str = str.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        //cnpj
        else {
            str = str.replace(/^(\d{2})(\d)/, '$1.$2');
            str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
            str = str.replace(/(\d{4})(\d)/, '$1-$2');
        }
        return str;
    };
});

