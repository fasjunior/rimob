angular.module("Rimob")
    .service("faceService", ["$dbOff", function ($dbOff) {
        this.obterFaces = function () {
            return $dbOff.selectAll("Face");
        };

        this.obterFacesPorQuadra = function (SqQuadra) {
            return $dbOff.selectAll("Face", options = {
                where: "SqQuadra = ?",
                parameters: [SqQuadra],
                orderby: "SqFace asc"
            });
        };
    }]);