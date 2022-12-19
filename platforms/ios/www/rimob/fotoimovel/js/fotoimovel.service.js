angular.module("Rimob")
    .service("fotoimovelService", ["$dbOff", function ($dbOff) {
        this.obterFotosImovel = function (SqImovelrecadastramento) {
            return $dbOff.selectAll("Foto", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            }); 
        };

        this.inserirFotosImovel = function (FotosImovel) {
            return $dbOff.insert("Foto", FotosImovel);
        };

        this.excluirFotosImovel = function (SqImovelrecadastramento) {
            return $dbOff.delete("Foto", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };

        this.obterQtFotosImovel = function () {
            return $dbOff.selectAll("Foto", options = {
                count: "1",
                ascount: "qtFotos"
            });
        };

    }]);