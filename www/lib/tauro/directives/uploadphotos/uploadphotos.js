(function () {
    var tauro = angular.module('Tauro');

    tauro.directive('taUploadPhotos', ['$mdDialog', '$q', function ($mdDialog, $q) {
        return {
            restrict: 'E',
            templateUrl: "lib/tauro/directives/uploadphotos/templates/uploadphotos.html",
            scope: {
                images: '=',
                availableQuantity: '<available'
            },
            controller: function ($scope, $element, $attrs) {
                $scope.enableSelection = false;
                $scope.totalSelected = 0;
                $scope.option = 'Selecionar';

                function setOptionsCamera(srcType) {
                    let options = {
                        // Some common settings are 20, 50, and 100
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        // In this app, dynamically set the picture source, Camera or photo gallery
                        sourceType: srcType,
                        encodingType: Camera.EncodingType.JPEG,
                        mediaType: Camera.MediaType.PICTURE,
                        allowEdit: true,
                        saveToPhotoAlbum: false,
                        cameraDirection: Camera.Direction.BACK,
                        correctOrientation: true  //Corrects Android orientation quirks
                    }
                    return options;
                }


                $scope.resize = function (img, maxW, maxH) {
                    let widthIsSmaller = (img.width < img.height);
                    if (widthIsSmaller) {
                        let ratio = 100 - Math.round((maxW * 100) / img.width);
                        img.height = Math.round(img.height - Math.round((img.height * ratio) / 100));
                        img.width = maxW;
                    }
                    else {
                        let ratio = 100 - Math.round((maxH * 100) / img.height);
                        img.width = Math.round(img.width - Math.round((img.width * ratio) / 100));
                        img.height = maxH;
                    }

                };

                $scope.removePictures = function () {
                    if($scope.totalSelected > 0){
                        let confirm = $mdDialog.confirm()
                      .title('Aviso')
                      .textContent('Deseja remover a(s) foto(s) selecionada(s)?')
                      .ariaLabel('Foto')
                      //.targetEvent(ev)
                      .ok('Sim, remover!')
                      .cancel('Não');

                        $mdDialog.show(confirm).then(function () {
                            let totalImages = $scope.images.length;
                            for (let i = totalImages - 1; i >= 0; i--) {
                                if ($scope.images[i].selected) {
                                    $scope.images.splice(i, 1);
                                    $scope.totalSelected = $scope.totalSelected - 1;
                                }
                            }
                            if ($scope.images.length == 0) {
                                $scope.enableSelection = false;
                                $scope.option = 'Selecionar';
                            }
                        });
                    }                  
                };

                $scope.thumbImage = function (imgUri) {
                    let deferred = $q.defer();
                    let img = new Image();
                    img.src = imgUri;
                    img.onload = function () {
                        let maxW = 150;
                        let maxH = 150;
                        $scope.resize(img, maxW, maxH);
                        let canvas = document.createElement('canvas');
                        canvas.width = maxW;
                        canvas.height = maxH;
                        let ctx = canvas.getContext("2d");
                        let dx = -(Math.max(img.width, maxW) - maxW) / 2;
                        let dy = -(Math.max(img.height, maxH) - maxH) / 2;
                        ctx.drawImage(img, dx, dy, img.width, img.height);
                        let dataurl = canvas.toDataURL("image/jpeg");

                        deferred.resolve(dataurl);
                    };
                    return deferred.promise;
                };
                
                $scope.$watch('images', function () {
                    if (angular.isDefined($scope.images)) {
                        angular.forEach($scope.images, function (value, key) {
                            let imageUri = "data:image/jpeg;base64," + value.Imagem;
                            $scope.thumbImage(imageUri).then(function (src) {
                                $scope.images[key].src = src;
                            });
                        });
                    }
                });

                $scope.checkOption = function (image) {
                    if ($scope.enableSelection) {
                        if (image.selected) {
                            $scope.totalSelected = $scope.totalSelected - 1;
                            image.selected = false;
                        }
                        else {
                            $scope.totalSelected = $scope.totalSelected + 1;
                            image.selected = true;
                        }
                    }
                    else {
                        $scope.showPicture(image);
                    }
                };
                    
                $scope.showPicture = function (selectedImage) {
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'lib/tauro/directives/uploadphotos/templates/showphoto.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: false, // Only for -xs, -sm breakpoints.
                        locals: {
                            image: selectedImage
                        }
                    })
                };

                $scope.selectPhotos = function () {
                    $scope.enableSelection = !$scope.enableSelection;
                    if ($scope.enableSelection) {
                        $scope.option = 'Cancelar';
                    }
                    else {
                        $scope.option = 'Selecionar';
                        $scope.totalSelected = 0;
                        angular.forEach($scope.images, function (value, key) {
                            value.selected = false;
                        });
                    }
                };

                $scope.takePicture = function (option) {
                    //Permite a adição de fotos caso esteja dentro do limite estabelecido por exportação
                    if ($scope.availableQuantity && $scope.images &&
                        ($scope.availableQuantity < $scope.images.length)
                    ) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .escapeToClose(false)
                                .title('Atenção')
                                .textContent('O limite de fotos por exportação foi excedido! Faça a exportação dos dados para liberar espaço e poder adicionar mais fotos.')
                                .ariaLabel('Foto do Imóvel')
                                .ok('  OK  ')
                        );
                    }
                    else {
                        let srcType;
                        if (option == 1) {
                            srcType = Camera.PictureSourceType.CAMERA;
                        }
                        else {
                            srcType = Camera.PictureSourceType.PHOTOLIBRARY;
                        }
                        let options = setOptionsCamera(srcType);
                        navigator.camera.getPicture(function (imageData) {
                            let imageUri = "data:image/jpeg;base64," + imageData;
                            let idImage = 1;
                            if ($scope.images) {
                                idImage = $scope.images.length + 1;
                            }
                            let name = 'Foto ' + idImage;
                            $scope.thumbImage(imageUri).then(function (src) {
                                $scope.images.push({ SqFoto: idImage, NmFoto: name, Imagem: imageData, src: src });
                                //$scope.$apply();
                            });

                        }, function (error) {
                            if (!(error.includes('has no access to assets')) && !(error.includes('no image selected')) &&
                                !(error.includes('Camera cancelled')) && !(error.includes('Selection cancelled'))) {

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(false)
                                        .escapeToClose(false)
                                        .title('Atenção')
                                        .textContent('Falha ao obter a imagem: ' + error)
                                        .ariaLabel('Foto do Imóvel')
                                        .ok('  OK  ')
                                );
                            }

                        }, options);
                    }
                };

                function DialogController($scope, $mdDialog, image) {
                    $scope.selectedImage = image;
                    $scope.selectedImage.srcComplete = "data:image/jpeg;base64," + $scope.selectedImage.Imagem;
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.answer = function (answer) {
                        $mdDialog.hide(answer);
                    };
                }

            }
        };
    }]);

})();