angular.module("Rimob")
    .service("fatorimovelService", ["$dbOff", function ($dbOff) {
        this.obterFatoresImovel = function (SqImovelrecadastramento) {
            return $dbOff.selectAll("Fator_Imovel", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };

        this.inserirFatoresImovel = function (FatoresImovel) {
            $dbOff.insert("Fator_Imovel", FatoresImovel);
        };

        this.excluirFatoresImovel = function (SqImovelrecadastramento) {
            return $dbOff.delete("Fator_Imovel", options = {
                where: "SqImovelrecadastramento = ?",
                parameters: [SqImovelrecadastramento]
            });
        };

    }]);