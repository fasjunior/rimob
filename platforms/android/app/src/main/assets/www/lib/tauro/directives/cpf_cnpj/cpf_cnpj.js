(function () {
    var tauro = angular.module('Tauro');

    tauro.directive("taCpfCnpj", function ($filter) {
        return {
            require: "ngModel",
            scope: {
                option: "@"
            },
            link: function (scope, element, attrs, ctrl) {

                function validaCPF(strCPF) {
                    let Soma;
                    let Resto;
                    Soma = 0;
                    if (strCPF == "00000000000" ||
                        strCPF == "00000000000" ||
                        strCPF == "11111111111" ||
                        strCPF == "22222222222" ||
                        strCPF == "33333333333" ||
                        strCPF == "44444444444" ||
                        strCPF == "55555555555" ||
                        strCPF == "66666666666" ||
                        strCPF == "77777777777" ||
                        strCPF == "88888888888" ||
                        strCPF == "99999999999") return false;

                    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
                    Resto = (Soma * 10) % 11;

                    if ((Resto == 10) || (Resto == 11)) Resto = 0;
                    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

                    Soma = 0;
                    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
                    Resto = (Soma * 10) % 11;

                    if ((Resto == 10) || (Resto == 11)) Resto = 0;
                    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
                    return true;
                }

                function validaCNPJ(c) {
                    var b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

                    if (/0{14}/.test(c))
                        return false;

                    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
                    if (c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
                        return false;

                    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
                    if (c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
                        return false;

                    return true;
                }
                var _format = function (number) {
                    if (number) {
                        number = number.replace(/[^0-9]+/g, "");
                        if (scope.option == "cnpj") {
                            if (number.length > 2) {
                                number = number.substring(0, 2) + "." + number.substring(2);
                            }
                            if (number.length > 6) {
                                number = number.substring(0, 6) + "." + number.substring(6);
                            }
                            if (number.length > 10) {
                                number = number.substring(0, 10) + "/" + number.substring(10);
                            }
                            if (number.length > 15) {
                                number = number.substring(0, 15) + "-" + number.substring(15, 17);
                            }
                        }
                        else {
                            if (number.length > 3) {
                                number = number.substring(0, 3) + "." + number.substring(3);
                            }
                            if (number.length > 7) {
                                number = number.substring(0, 7) + "." + number.substring(7);
                            }
                            if (number.length > 11) {
                                let max = 16;
                                if (scope.option == "cpf") {
                                    max = 13;
                                }
                                number = number.substring(0, 11) + "-" + number.substring(11, max);
                            }
                            if (number.length > 14) {
                                number = number.replace('.', "");
                                number = number.replace('.', "");
                                number = number.replace('-', "");

                                number = number.substring(0, 2) + "." + number.substring(2, 5) + "." + number.substring(5, 8) + "/" + number.substring(8, 12) + "-" + number.substring(12, 14);
                            }
                        }
                    }

                    return number;
                };

                element.bind("keyup", function () {
                    ctrl.$setViewValue(_format(ctrl.$viewValue));
                    ctrl.$render();
                });

                element.bind("blur", function () {
                    ctrl.$setViewValue(_format(ctrl.$viewValue));
                    ctrl.$render();
                });
                element.bind("load", function () {
                    ctrl.$setViewValue(_format(ctrl.$viewValue));
                    ctrl.$render();
                });

                ctrl.$parsers.push(function (value) {
                    if (value && value.length === 14) {
                        ctrl.$setValidity('cnpjInvalid', true);
                        let cpf = value.replace(/\./g, '');
                        cpf = cpf.replace('-', '');
                        if (validaCPF(cpf)) {
                            ctrl.$setValidity('cpfInvalid', true);
                        }
                        else {
                            ctrl.$setValidity('cpfInvalid', false);
                        }

                        return cpf;
                    }
                    if (value && value.length === 18) {
                        ctrl.$setValidity('cpfInvalid', true);
                        let cnpj = value.replace(/\./g, '');
                        cnpj = cnpj.replace('/', '');
                        cnpj = cnpj.replace('-', '');
                        if (validaCNPJ(cnpj)) {
                            ctrl.$setValidity('cnpjInvalid', true);
                        }
                        else {
                            ctrl.$setValidity('cnpjInvalid', false);
                        }
                        return cnpj;
                    }
                });
            }
        };
    });
})();