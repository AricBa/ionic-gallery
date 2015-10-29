
(function () {
    'use strict';
        angular
        .module('app.gallery')
        .controller('GalleryCtrl', function($state,$scope,headers,Restangular,$ionicLoading) {
              $scope.results = headers.results;
              $scope.count = headers.totalCount;
              $scope.page = headers.pageIndex;
              $scope.pageSize = headers.pageSize;


              $scope.goDetail = function(index){
                  $state.go('app.poHeader',{poNumber:index});
              };

              $scope.isMoreData = function () {
                  console.log($scope.page < ($scope.count / $scope.pageSize));
                  return $scope.page < ($scope.count / $scope.pageSize);
              };

              $scope.loadMoreData = function(){
                  $scope.page++;
                  Restangular.all('sap/po/purchase_orders').customGET('',{pageIndex : $scope.page}).then(function(response){
                      Array.prototype.push.apply($scope.results, response.results);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      console.log($scope.results);
                  })
              };
              //$scope.$on('$stateChangeSuccess', function() {
              //    $scope.loadMoreData();
              //});

              $scope.refresh = function(){
                  $ionicLoading.show({
                      template: 'Loading...'
                  });
                  Restangular.all('sap/po/purchase_orders').customGET('',{pageIndex : "1"}).then(function(response){
                      $scope.results= response.results;
                      $scope.count = response.totalCount;
                      $scope.page = response.pageIndex;
                      $scope.pageSize = response.pageSize;
                  }).finally(function(){
                      console.log('$scope.refresh');
                      $scope.$broadcast('scroll.refreshComplete');
                      $ionicLoading.hide();
                  });
              };
          })
        .controller('headerCtrl',function(PO,$scope,$state) {
              $scope.po = PO[0].results[0];
              $scope.approve = PO[1];

              $scope.goToItems = function(){
                  $state.go('app.items',{poNumber:$scope.po.PO_NUMBER});
              }
          })
        .controller('itemsCtrl',function(items,$scope,$state,$stateParams,Restangular,$ionicLoading,$ionicSideMenuDelegate){
            $scope.do = function(){
              $ionicSideMenuDelegate.toggleRight();
            };

              $scope.count = items.totalCount;
              $scope.page = items.pageIndex;
              $scope.pageSize = items.pageSize;
              $scope.results = items.results;
              console.log($scope.results);

              $scope.goDetail = function(index){
                  $state.go('app.itemDetail',{poNumber:$stateParams.poNumber,itemId:index});
              };

              $scope.isMoreData = function () {
                  console.log($scope.page < ($scope.count / $scope.pageSize));
                  return $scope.page < ($scope.count / $scope.pageSize);
              };

              $scope.loadMoreData = function(){
                  $scope.page++;
                  Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/items').customGET('',{pageIndex : $scope.page}).then(function(response){
                      Array.prototype.push.apply($scope.results, response.results);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      console.log($scope.results);
                  })
              };
              //$scope.$on('$stateChangeSuccess', function() {
              //    $scope.loadMoreData();
              //});

              $scope.refresh = function(){
                  $ionicLoading.show({
                      template: 'Loading...'
                  });
                  Restangular.all('sap/po/purchase_orders/'+$stateParams.poNumber+'/items').customGET('',{pageIndex : "1"}).then(function(response){
                      $scope.results= response.results;
                      $scope.count = response.totalCount;
                      $scope.page = response.pageIndex;
                      $scope.pageSize = response.pageSize;
                  }).finally(function(){
                      console.log('$scope.refresh');
                      $scope.$broadcast('scroll.refreshComplete');
                      $ionicLoading.hide();
                  });
              };
          })
        .controller('itemDetailCtrl', function(item,$scope){
              $scope.item = item.results[0];
          })
        .directive('createTask', function ( ) {
          return {
              restrict: "EA",
              scope: {
                  buttonText: '=',
                  status:'=',
                  poNum: '='// Use @ for One Way Text Binding;Use = for Two Way Binding;Use & to Execute Functions in the Parent Scope
              },
              controller: function ($ionicPopup,$scope,Restangular,$ionicLoading,$timeout) {
                      $scope.ionicPopup = {
                          title: 'Approve po',
                          cssClass: 'ionicPopup',
                          //template: 'OK',
                          cancelText: 'CANCEL',
                          cancelType: 'button button-clear button-positive',
                          okText: 'APPROVE',
                          okType: 'button button-clear button-positive'
                      };

                      $scope.showConfirm = function () {
                          var confirmPopup = $ionicPopup.confirm($scope.ionicPopup);
                          confirmPopup.then(function (res) {
                              if (res) {
                                  $ionicLoading.show({
                                      template:'Loading...'
                                  });
                                console.log($scope.poNum);
                                  Restangular.all('sap/po/purchase_orders/'+$scope.poNum+'/status').customGET().then(function(response){
                                    console.log(response.results[0].DM_STATUS);
                                    console.log($scope.status);
                                      if(response.results[0].DM_STATUS == $scope.status) {
                                        if($scope.buttonText == 'Approve'){
                                          Restangular.all('sap/po/purchase_orders/'+$scope.poNum+'/approve').post().then(function(response){
                                            $ionicLoading.hide();
                                            $ionicLoading.show({
                                              template:'the task is approving'
                                            });
                                            $timeout(function() {
                                              $ionicLoading.hide();
                                            }, 1000);
                                            $scope.buttonText = 'Lock';
                                            console.log(response);
                                            console.log('approve');
                                          });
                                        }else if( $scope.buttonText =='Reset'){
                                          Restangular.all('sap/po/purchase_orders/'+$scope.poNum+'/reset').post().then(function(response){
                                            $ionicLoading.hide();
                                            $ionicLoading.show({
                                              template:'the task is reseted'
                                            });
                                            $timeout(function() {
                                              $ionicLoading.hide();
                                            }, 1000);
                                            $scope.buttonText = 'Approve';
                                            console.log(response);
                                            console.log('reset');
                                          })
                                        }else{
                                          console.log("Locked");
                                          $ionicLoading.hide();
                                        }
                                      }else{
                                        $ionicLoading.hide();
                                        $ionicLoading.show({
                                          template:'status has changed'
                                        });
                                        $timeout(function() {
                                          $ionicLoading.hide();
                                        }, 1000);
                                      }
                                  });

                              } else {
                                  console.log('cancel');
                              }
                          });
                      };
              },

              template: '<button  ng-click="showConfirm()">{{buttonText}}</button>',
              replace: true
          };
          })
        .factory('searchHistory', function (localStorageService) {
          var searchHistory;
          searchHistory = {
              getHistory: function (arrayName) {
                  if (typeof  localStorageService.get(arrayName) !== 'undefined'
                    && localStorageService.get(arrayName) !== null) {
                      return localStorageService.get(arrayName);
                  } else {
                      return {};
                  }
              },
              indexInHistory: function (arrayName, key) {
                  var arr = this.getHistory(arrayName);
                  var hash = {};
                  for (var i = 0; i < arr.length; i += 1) {
                      hash[arr[i]] = i;
                  }
                  return !!(hash.hasOwnProperty(key))
              },
              objSize: function (obj) {
                  var size = 0, key;
                  for (key in obj) {
                      if (obj.hasOwnProperty(key)) size++;
                  }
                  return size;
              },
              updateHistory: function (arrayName, key) {
                  console.log(this);
                  var obj = this.getHistory(arrayName);

                  if (!obj.hasOwnProperty(key)) {
                      //var i=this.objSize(obj);
                      obj[key] = key;
                  }
                  localStorageService.set(arrayName, obj);
                  return obj;
              },

              deleteHistory: function (arrayName, key) {
                  var obj = this.getHistory(arrayName);

                  if (obj.hasOwnProperty(key)) {
                      //var i=this.objSize(obj);
                      delete obj[key];
                  }
                  localStorageService.set(arrayName, obj);
                  return obj;

              }


          };
          return searchHistory;
      });
})();
