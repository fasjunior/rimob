(function () {
    var tauro = angular.module('Tauro');

    tauro.directive("taTel", function ($filter) {
        return {
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                var _formatTel = function (tel) {
                    if (tel) {
                        tel = tel.replace(/[^0-9]+/g, "");
                        if (tel.length > 0) {
                            tel = "(" + tel.substring(0);
                        }
                        if (tel.length > 3) {
                            tel = tel.substring(0, 3) + ")" + tel.substring(3);
                        }
                        if (tel.length > 8) {
                            tel = tel.substring(0, 8) + "-" + tel.substring(8, 13);
                        }
                        if (tel.length > 13) {
                            tel = tel.replace('-', "");
                            tel = tel.substring(0, 9) + "-" + tel.substring(9, 14);
                        }
                    }
                    
                    return tel;
                };

                element.bind("keyup", function () {
                    ctrl.$setViewValue(_formatTel(ctrl.$viewValue));
                    ctrl.$render();
                });

                ctrl.$parsers.push(function (value) {
                    if (value.length >= 13) {
                        return value;
                    }
                });
            }
        };
    });
})();