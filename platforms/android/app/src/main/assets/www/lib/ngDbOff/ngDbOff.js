var databaseModel;
var db;

(function () {
  angular.module("ngDbOff", []);

  angular.module("ngDbOff").service("$dbOff", [
    "$http",
    "$q",
    "$rootScope",
    "$mdDialog",
    "appConfig",
    function ($http, $q, $rootScope, $mdDialog, appConfig) {
      /*
            Estrutura do Banco de Dados Local
        */
      //Obtém o modelo de dados em formato json
      this.getDataBaseModel = function () {
        let o = this;
        return $http
          .get("lib/ngDbOff/dboff.database.json")
          .then(function (response) {
            databaseModel = angular.fromJson(response.data);
            o.openDB();
          });
      };
      this.getDBModel = function () {
        let o = this;
        let deferred = $q.defer();
        $http.get("lib/ngDbOff/dboff.database.json").then(function (response) {
          databaseModel = angular.fromJson(response.data);
          o.openDB()
            .then(function () {
              deferred.resolve(databaseModel);
            })
            .catch(function (e) {
              deferred.reject(e);
            });
        });
        return deferred.promise;
      };

      /*Abre a conexão com o banco de dados*/
      this.openDB = function () {
        let deferred = $q.defer();
        if (!databaseModel) {
          console.log("O modelo de dados não foi inicializado.");
          deferred.reject();
        }
        try {
          document.addEventListener(
            "deviceready",
            function () {
              db = window.sqlitePlugin.openDatabase({
                name: databaseModel.dataBase,
                location: "default",
              });
              if (!db) {
                alert("Não foi possível abrir o banco de dados!");
                deferred.reject();
              } else deferred.resolve(databaseModel);
            },
            false
          );
        } catch (e) {
          console.log("erro: ", e);
          deferred.reject(e);
        }
        return deferred.promise;
      };

      /*
            Cria dinamicamente a query que irá criar a tabela no banco de dados local
        */
      this.sqlCreateTable = function (table) {
        let sqlQuery = "create table if not exists '" + table.tableName + "' ";
        sqlQuery += "(";

        //Percorre as colunas
        angular.forEach(table.columns, function (value, key) {
          sqlQuery += key + " " + value;
          sqlQuery += ",";
        });
        //Verifica se a tabela possui primary key
        if (table.hasOwnProperty("primaryKey")) {
          sqlQuery += "primary key (" + table.primaryKey + ")";
        } else {
          sqlQuery = sqlQuery.substring(0, sqlQuery.lastIndexOf(",")); //remove a última vírgula
        }
        sqlQuery += ")";
        //console.log(sqlQuery);
        return sqlQuery;
      };

      /*
            Cria o banco de dados
        */
      this.createDataBase = function () {
        let o = this;
        let allDeferred = $q.defer();
        let promises = [];
        if (databaseModel) {
          o.openDB();
          if (db) {
            db.transaction(function (tx) {
              for (let table of databaseModel.tables) {
                let deferred = $q.defer();
                let sqlTable = o.sqlCreateTable(table);
                tx.executeSql(
                  sqlTable,
                  [],
                  function (tx, result) {
                    deferred.resolve(true);
                  },
                  function (tx, error) {
                    console.log(error.message);
                    deferred.resolve(null);
                  }
                );
                promises.push(deferred.promise);
              }

              $q.all(promises)
                .then(function (results) {
                  results = results.length == 1 ? results[0] : results;
                  allDeferred.resolve(results);
                })
                .catch(function (err) {
                  allDeferred.reject(results);
                });
            });
          } else {
            console.log("A conexão com o banco de dados não foi inicializada.");
            allDeferred.reject();
          }
        } else {
          console.log("O modelo de dados não foi inicializado.");
          allDeferred.reject();
        }
        return allDeferred.promise;
      };

      this.checkDB = function () {
        let deferred = $q.defer();
        let scripts;
        let dbID;
        let lastID;
        let requiredUpdate = false;
        let o = this;
        o.executeQuery("select id from Db_Version;")
          .then(function (response) {
            dbID =
              response && response[0] && response[0].id ? response[0].id : 0;
            lastID = appConfig.dbVersion;
            requiredUpdate = dbID < lastID;
            if (requiredUpdate) {
              return $http.get("update/scripts.sql.json");
            }
          })
          .then(
            function (response) {
              scripts =
                response && response.data
                  ? angular.fromJson(response.data)
                  : [];
              if (
                requiredUpdate &&
                angular.element(document).find("md-dialog").length <= 0
              ) {
                $mdDialog.show({
                  controller: dialogUpdateDB,
                  templateUrl: "update/dialog-update-db.html",
                  parent: angular.element(document.window),
                  clickOutsideToClose: false,
                });
                return o.executeQueriesCheckDB(scripts, dbID, lastID);
              } else {
                return null;
              }
            },
            function (error) {
              $rootScope.$broadcast("updateDB", { completed: 2 });
              deferred.resolve(true);
            }
          )
          .then(function () {
            $rootScope.$broadcast("updateDB", { completed: 1 });
            deferred.resolve(true);
          });
        return deferred.promise;
      };

      this.executeQueriesCheckDB = function (scripts, current, last) {
        let o = this;
        if (current < last) {
          return o.executeQuery(scripts[current++].queries).then(function () {
            return o.executeQueriesCheckDB(scripts, current, last);
          });
        }
      };

      this.executeQuery = function (query) {
        let allDeferred = $q.defer();
        let promises = [];

        let queries = Array.isArray(query) ? query : new Array(query);

        db.transaction(function (tx) {
          for (let sqlTransaction of queries) {
            let deferred = $q.defer();
            tx.executeSql(
              sqlTransaction,
              [],
              function (tx, result) {
                let data = [];
                for (let i = 0; i < result.rows.length; i++) {
                  data.push(result.rows.item(i));
                }
                deferred.resolve(data);
              },
              function (tx, error) {
                console.log(
                  "executeQuery: " +
                    sqlTransaction +
                    ". Error: " +
                    error.message
                );
                deferred.resolve(null);
              }
            );
            promises.push(deferred.promise);
          }
          $q.all(promises)
            .then(function (results) {
              results = results.length == 1 ? results[0] : results;
              allDeferred.resolve(results);
            })
            .catch(function (err) {
              allDeferred.reject(results);
            });
        });

        return allDeferred.promise;
      };

      this.dropAllTables = function () {
        let o = this;
        let allDeferred = $q.defer();
        let promises = [];
        let sqlQuery = "";
        let sqlTransactions = [];
        if (databaseModel) {
          o.openDB();
          if (db) {
            for (let table of databaseModel.tables) {
              sqlQuery = "drop table " + table.tableName;
              sqlTransactions.push(sqlQuery);
            }
            db.transaction(function (tx) {
              for (let sqlTransaction of sqlTransactions) {
                let deferred = $q.defer();
                tx.executeSql(
                  sqlTransaction,
                  [],
                  function (tx, result) {
                    deferred.resolve(true);
                  },
                  function (erro) {
                    deferred.reject(erro);
                  }
                );
                promises.push(deferred.promise);
              }

              $q.all(promises)
                .then(function (results) {
                  results = results.length == 1 ? results[0] : results;
                  allDeferred.resolve(results);
                })
                .catch(function (err) {
                  allDeferred.reject(results);
                });
            });
          }
        } else {
          allDeferred.reject();
        }

        return allDeferred.promise;
      };

      this.onError = function (tx, error) {
        console.log(error.message);
      };

      /*Verifica se existe tabela na estrutura de dados*/
      this.tableExists = function (tableName) {
        for (let table of databaseModel.tables) {
          if (
            table.tableName.toLocaleLowerCase() == tableName.toLocaleLowerCase()
          ) {
            return true;
          }
        }
        return false;
      };

      this.getTableByName = function (tableName) {
        for (let table of databaseModel.tables) {
          if (
            table.tableName.toLocaleLowerCase() == tableName.toLocaleLowerCase()
          ) {
            return table;
          }
        }
        return undefined;
      };

      this.insert = function (tableName, jsonData) {
        let o = this;
        let allDeferred = $q.defer();
        let promises = [];

        if (!this.tableExists(tableName)) {
          console.log("Tabela '" + tableName + "' inexistente!");
          return;
        }

        let table = o.getTableByName(tableName);

        let sqlQuery = "";

        let sqlTransactions = [];

        //Percorre os itens do json
        angular.forEach(jsonData, function (item) {
          sqlQuery = "insert into " + tableName;
          sqlQuery += "(";

          let jsonColumnCollection = [];
          let parameters = "";

          Object.keys(jsonData[0]).forEach(function (key) {
            let columnName = key.toLowerCase();

            //Verifica se o objeto columns possui a coluna associada ao Json
            //Ex: nm_bairro --> NmBairro, sq_tipoImovel --> SqTipoimovel
            if (
              Object.keys(table.columns).filter(function (v) {
                return v.toLowerCase() === columnName.toLowerCase();
              }).length > 0
            ) {
              sqlQuery += columnName + ",";
              parameters += "?,";
              jsonColumnCollection.push(key);
            }
          });

          parameters = parameters.substring(0, parameters.lastIndexOf(",")); //remove a última vírgula
          sqlQuery = sqlQuery.substring(0, sqlQuery.lastIndexOf(",")); //remove a última vírgula
          sqlQuery += ") ";
          sqlQuery += "values(" + parameters + ")";

          /*Cria um novo array irá conter somente as colunas do banco de dado offline*/
          let newRow = [];
          for (let jsonColumn of jsonColumnCollection) {
            newRow.push(item[jsonColumn]);
          }

          //console.log(sqlQuery);
          //Armazena a query e seus respectivos parâmetros para posteriormente serem executados
          sqlTransactions.push({ sqlQuery: sqlQuery, sqlParameters: newRow });
          sqlQuery = "";
        });

        //Insere os registros num contexto transacional
        db.transaction(function (tx) {
          for (let sqlTransaction of sqlTransactions) {
            let deferred = $q.defer();
            tx.executeSql(
              sqlTransaction.sqlQuery,
              sqlTransaction.sqlParameters,
              function (tx, result) {
                deferred.resolve(true);
              },
              function (tx, error) {
                console.log(error.message);
                deferred.resolve(null);
              }
            );
            promises.push(deferred.promise);
          }

          $q.all(promises)
            .then(function (results) {
              results = results.length == 1 ? results[0] : results;
              allDeferred.resolve(results);
            })
            .catch(function (err) {
              allDeferred.reject(results);
            });
        });
        return allDeferred.promise;
      };

      /*
            Seleciona todas as colunas da tabela
        */
      this.selectAll = function (tableName, options) {
        let o = this;

        if (!o.tableExists(tableName)) {
          console.log("Tabela '" + tableName + "' inexistente!");
          return;
        }

        let sqlQuery = "select ";
        let table = o.getTableByName(tableName);

        if (options && options.max) {
          sqlQuery += "max(" + options.max + ") as max";
        } else {
          angular.forEach(table.columns, function (value, key) {
            let columnName = key;
            if (
              options &&
              (options.join || options.leftjoin) &&
              options.columnsjoin
            )
              columnName = tableName + "." + columnName;
            sqlQuery += columnName + ",";
          });
          sqlQuery = sqlQuery.substring(0, sqlQuery.lastIndexOf(",")); //remove a última vírgula
        }

        if (options && options.count && options.ascount) {
          sqlQuery += ", count(" + options.count + ") as " + options.ascount;
        }

        sqlQuery += " from " + tableName + " ";

        if (
          options &&
          (options.leftjoin || options.join) &&
          options.columnsjoin
        ) {
          let optionJoin = options.leftjoin ? "left join " : "join ";
          sqlQuery += optionJoin + options.leftjoin + " on ";
          if (options.columnsjoin) {
            sqlQuery +=
              o.setColumnsJoin(
                tableName,
                options.leftjoin,
                options.columnsjoin
              ) + " ";
          }
          if (options.onjoin) {
            sqlQuery += options.columnsjoin
              ? "and " + options.onjoin + " "
              : options.onjoin + " ";
          }
        }

        if (options && options.where) {
          sqlQuery +=
            "where " +
            o.replaceParametersWithValues(options.where, options.parameters) +
            " ";
        }

        if (options && options.groupby) {
          sqlQuery += "group by " + options.groupby + " ";
        }

        if (options && options.orderby) {
          sqlQuery += "order by " + options.orderby;
        }

        if (options && options.limit) {
          sqlQuery += " limit " + options.limit;
        }

        //console.log(sqlQuery);
        let deferred = $q.defer();
        let data = [];
        db.transaction(function (tx) {
          tx.executeSql(
            sqlQuery,
            [],
            function (tx, result) {
              for (let i = 0; i < result.rows.length; i++) {
                data.push(result.rows.item(i));
              }
              deferred.resolve(data);
            },
            function (tx, error) {
              console.log(error.message);
              deferred.reject(tx);
            }
          );
        });

        return deferred.promise;
      };

      this.delete = function (tableName, options) {
        if (!this.tableExists(tableName)) {
          console.log("Tabela '" + tableName + "' inexistente!");
          return;
        }

        let o = this;
        let sqlQuery = "delete from " + tableName + " ";
        let table = o.getTableByName(tableName);

        if (options && options.where) {
          sqlQuery +=
            "where " +
            o.replaceParametersWithValues(options.where, options.parameters) +
            " ";
        }

        let deferred = $q.defer();

        db.transaction(function (tx) {
          tx.executeSql(sqlQuery, [], function (tx, result) {
            deferred.resolve(result);
          });
        });

        return deferred.promise;
      };

      this.update = function (tableName, options) {
        if (!this.tableExists(tableName)) {
          console.log("Tabela '" + tableName + "' inexistente!");
          return;
        }
        let o = this;
        let table = o.getTableByName(tableName);
        let sqlQuery = "update " + tableName + " set ";
        let jsonColumnCollection = [];
        let sqlParameters = [];

        if (options && options.set) {
          sqlQuery +=
            o.replaceParametersWithValues(options.set, options.parametersSet) +
            " ";
        } else {
          Object.keys(options.object).forEach(function (key) {
            let columnName = key.toLowerCase();

            //Verifica se o objeto columns possui a coluna associada ao Json
            //Ex: nm_bairro --> NmBairro, sq_tipoImovel --> SqTipoimovel
            if (
              Object.keys(table.columns).filter(function (v) {
                return v.toLowerCase() === columnName.toLowerCase();
              }).length > 0
            ) {
              if (!o.isPrimaryKey(table, key)) {
                sqlQuery += key + "=?" + ", ";
                jsonColumnCollection.push(key);
              }
            }
          });
          sqlQuery = sqlQuery.substring(0, sqlQuery.lastIndexOf(",")); //remove a última vírgula
          /*Cria um novo array irá conter somente as colunas do banco de dados offline*/

          for (let jsonColumn of jsonColumnCollection) {
            sqlParameters.push(options.object[jsonColumn]);
          }
        }

        if (options && options.where) {
          sqlQuery +=
            " where " +
            o.replaceParametersWithValues(options.where, options.parameters) +
            " ";
        }

        //console.log(sqlQuery);
        let deferred = $q.defer();
        db.transaction(function (tx) {
          tx.executeSql(
            sqlQuery,
            sqlParameters,
            function (tx, result) {
              deferred.resolve(result);
            },
            o.onError
          );
        });

        return deferred.promise;
      };

      this.isPrimaryKey = function (table, columnName) {
        let o = this;
        if (table.primaryKey) {
          let primaryKeyArray = table.primaryKey.split(",");
          for (let i = 0; i < primaryKeyArray.length; i++) {
            if (
              primaryKeyArray[i].trim().toLowerCase() ==
              columnName.toLowerCase()
            ) {
              return true;
            }
          }
        }

        return false;
      };

      this.replaceParametersWithValues = function (where, parameters) {
        let result = "";
        let listParameters = where.split("?");
        for (let i = 0; i < listParameters.length; i++) {
          result += listParameters[i];
          if (parameters[i] != undefined) {
            let parameter = parameters[i];

            if (Array.isArray(parameter)) {
              parameter = "(" + parameter.join(",") + ")";
            }

            result += parameter;
          }
        }
        return result;
      };

      this.setColumnsJoin = function (table1, table2, columns) {
        let result = "";
        let columnsJoin = [];

        for (let i = 0; i < columns.length; i++) {
          result = table1 + "." + columns[i] + "=" + table2 + "." + columns[i];
          columnsJoin.push(result);
        }

        if (columnsJoin.length > 1) {
          result = columnsJoin.join(" and ");
        }

        return result;
      };

      function dialogUpdateDB($scope, $mdDialog, $route, $timeout) {
        $scope.status =
          "Atualizando a estrutura do Rimob para a nova versão...";
        $scope.completed = 0;
        $scope.hide = function () {
          $mdDialog.hide();
        };

        $scope.cancel = function () {
          $mdDialog.cancel();
          $route.reload();
          //$location.path('/').replace();
        };

        $scope.answer = function (answer) {
          $mdDialog.hide(answer);
        };

        $scope.$on("updateDB", function (event, args) {
          $timeout(function () {
            $scope.status =
              args.completed == 1
                ? "Atualização concluida com sucesso!"
                : "Falha ao tentar atualizar!";
            $scope.completed = args.completed;
          }, 4000);
        });
      }
    },
  ]);
})();
