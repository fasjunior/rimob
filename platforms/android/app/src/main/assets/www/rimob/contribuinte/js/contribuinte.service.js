angular.module("Rimob")
    .service("contribuinteService", ["$dbOff", function ($dbOff) {
        this.obterContribuinte = function (SqContribuinterecadastramento) {
            return $dbOff.selectAll("Contribuinte", options = {
                where: "SqContribuinterecadastramento = ?",
                parameters: [SqContribuinterecadastramento]
            });
        };

        this.obterContribuintes = function () {
            return $dbOff.selectAll("Contribuinte", options = { orderby: "SqContribuinterecadastramento asc" });

        };

        this.obterSqContribuinteRecadMax = function () {
            return $dbOff.selectAll("Contribuinte", options = { max: "SqContribuinterecadastramento" });

        };
        
        this.obterQtContribuintes = function () {
            return $dbOff.selectAll("Contribuinte", options = {
                count: "SqContribuinterecadastramento",
                ascount: "qtContribuintes"
            });
        };

        this.obterQtNovosContribuintes = function () {
            return $dbOff.selectAll("Contribuinte", options = {
                count: "SqContribuinterecadastramento",
                ascount: "qtContribuintes",
                where: "SqContribuinte is ?",
                parameters: ['null']
            });
        };

        this.inserirContribuinte = function (contribuinte) {
            $dbOff.insert("Contribuinte", [contribuinte]);
        };

        this.obterContribuintesBusca = function (DsBusca) {
            return $dbOff.selectAll("Contribuinte", options = {
                where: "NmContribuinte like('%?%')",
                orderby: "SqContribuinterecadastramento asc",
                parameters: [DsBusca],
                limit: "5"

            });

        };

        this.editarContribuinte = function (Contribuinte, SqContribuinterecadastramento) {
            return $dbOff.update("Contribuinte", options = {
                where: "SqContribuinterecadastramento = ?",
                parameters: [SqContribuinterecadastramento],
                object: Contribuinte
            });
        };
    }]);