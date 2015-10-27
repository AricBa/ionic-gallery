/**
 * Gallery route.
 *
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   The MIT License {@link http://opensource.org/licenses/MIT}
 */
(function () {
    'use strict';

    /**
     * @ngdoc object
     * @name galleryRoute
     * @module app.gallery
     * @requires $stateProvider
     * @description
     * Router for the gallery page.
     *
     * @ngInject
     */
    function galleryRoute($stateProvider) {
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
                    images: function(ImageService){
                        return ImageService.getByUser();
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
                      var a = $q.defer();

                      var thenFn = function (value) {
                            console.log('resolved ', value);
                            return value;
                        }, d0 = $q.defer(), d1 = $q.defer(),f0=d0.promise,f1=d1.promise;
                      $ionicLoading.show({
                          template:'Loading'
                      });

                      Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber).customGET().then(function(response){
                          d0.resolve(response);
                      },function(err){
                          d0.reject(err);
                      });

                      Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/status').customGET().then(function(response){
                          console.log(response);
                          if(response.results[0].DM_STATUS == 0) {
                              d1.resolve('Approve');
                          }else if (response.results[0].DM_STATUS == 1){
                              d1.resolve('Lock');
                          }else{
                              d1.resolve('Reset');
                          }
                      },function(err){
                          d1.reject(err);
                      });

                      $q.all([f0.then(thenFn),f1.then(thenFn)]).then(function(values){
                          a.resolve(values);
                          $ionicLoading.hide();
                      });

                      return a.promise;
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

                      Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/items/').customGET('',{pageIndex : "1"}).then(function(response){
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
          });
    }

    angular
        .module('app.gallery')
        .config(galleryRoute);

})();
