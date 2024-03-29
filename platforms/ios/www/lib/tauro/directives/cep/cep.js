﻿(function () {
    var tauro = angular.module('Tauro');

    tauro.directive("taCep", function ($filter) {
        return {
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                var _formatCep = function (cep) {
                    cep = cep.replace(/[^0-9]+/g, "");
                    if (cep.length > 2) {
                        cep = cep.substring(0, 2) + "." + cep.substring(2);
                    }
                    if (cep.length > 6) {
                        cep = cep.substring(0, 6) + "-" + cep.substring(6, 9);
                    }
                    return cep;
                };

                element.bind("keyup", function () {
                    ctrl.$setViewValue(_formatCep(ctrl.$viewValue));
                    ctrl.$render();
                });

                ctrl.$parsers.push(function (value) {
                    if (value.length === 10) {
                        return value;
                    }
                });
            }
        };
    });

})();