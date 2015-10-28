
(function () {
    'use strict';

    angular
        .module('app.gallery')
        .config(function($stateProvider) {
          $stateProvider
            .state('app.gallery', {
                url: '/galleries/:userId',
                views: {
                    'menuContent': {
                        templateUrl: 'js/routes/gallery/gallery.html',
                        controller: 'GalleryCtrl as vm'
                    }
                },
                resolve: {/* @ngInject */
                    headers: function(Restangular){
                        return Restangular.all('sap/po/purchase_orders').customGET('',{pageIndex : "1"});
                    }
                },
                data: {
                    authenticate: true
                }
            })
            .state('app.poHeader',{
                url:'poHeaders/:poNumber',
                views:{
                    'menuContent':{
                        templateUrl: 'js/routes/gallery/header.html',
                        controller:'headerCtrl as vm'
                    }
                },
                resolve:{
                    PO :function ($stateParams,Restangular,$q,$ionicLoading){
                        var d = $q.defer();

                        $ionicLoading.show({
                            template:'Loading...'
                        });

                        Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber).customGET().then(function(response){
                            if(response.results[0].DM_STATUS == 0) {
                                d.resolve([response,'Approve']);
                            }else if (response.results[0].DM_STATUS == 1){
                                d.resolve([response,'Lock']);
                            }else{
                                d.resolve([response,'Reset']);
                            }
                            $ionicLoading.hide();
                        },function(err){
                            d.reject(err);
                            $ionicLoading.hide();
                        });

                        //Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/status').customGET().then(function(response){
                        //    console.log(response);
                        //
                        //},function(err){
                        //    d1.reject(err);
                        //});

                        return d.promise;
                    }
                },
                data: {
                    authenticate: true
                }

            })
            .state('app.items',{
                url:'poHeaders/:poNumber/items',
                views:{
                    'menuContent':{
                        templateUrl: 'js/routes/gallery/items.html',
                        controller:'itemsCtrl as vm'
                    }
                },
                resolve:{
                    items:function($stateParams,Restangular,$q,$ionicLoading){
                        var d = $q.defer();
                        $ionicLoading.show({
                            template:'Loading'
                        });

                        Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/items').customGET('',{pageIndex : "1"}).then(function(response){
                            d.resolve(response);
                            $ionicLoading.hide();
                        });

                        return d.promise;
                    }
                },
                data: {
                    authenticate: true
                }
            })
            .state('app.itemDetail',{
                url:'poHeaders/:poNumber/items/:itemId',
                views:{
                    'menuContent':{
                        templateUrl: 'js/routes/gallery/itemDetail.html',
                        controller:'itemDetailCtrl as vm'
                    }
                },
                resolve:{
                    item:function($stateParams,Restangular){
                        return Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/items/'+$stateParams.itemId).customGET();
                    }
                },
                data: {
                    authenticate: true
                }
            })
            .state('singlePageTemplate',{
                url:'/singlePageTemplate/:poNumber?items?itemsId',
                views:{
                    'menuContent':{
                        templateUrl: 'js/routes/gallery/single-page-template.html',
                        controller:'singlePageTemplateCtrl'
                    }
                },
                resolve:{
                    resolveObj: function($q,ionicLoading, restApi, $stateParams){

                    }
                },
            });
      });
})();
