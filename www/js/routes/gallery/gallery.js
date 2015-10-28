/**
 * Gallery module.
 *
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   The MIT License {@link http://opensource.org/licenses/MIT}
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.gallery
     */
    angular.module('app.gallery', [])
      .factory('restApi',function(Restangular){
          var restApi;
          restApi = {
              getData: function(route,path,params,headers){
                 return Restangular.all(route).customGET(path,params,headers);
              },
              post: function(route){
                  return Restangular.all(route).post();
              }
          }

          return restApi;
      });

})();
