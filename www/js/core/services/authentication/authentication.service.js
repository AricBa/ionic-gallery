/**
 * Authentication service.
 *
 * @author    Martin Micunda {@link http://martinmicunda.com}
 * @copyright Copyright (c) 2015, Martin Micunda
 * @license   The MIT License {@link http://opensource.org/licenses/MIT}
 */
(function () {
    'use strict';

    /**
     * @ngInject
     */
    function AuthenticationProvider() {
        this.$get = function($http, Restangular, Token, localStorageService) {
            var currentUser = null;
            function saveUserAndToken(token) {
                // store token to local storage
                Token.set(token);
                // decode user data from payload token
                currentUser = Token.decodeToken(token);
                // save user to locale storage
                localStorageService.set('user', currentUser);

                //Restangular.all('sap/po/purchase_orders/4500017458').customGET('',{token:token}).then(function(response){
                //    console.log(response);
                //},function(error){
                //    console.log(error);
                //})
            }

            return {
                signup: function(params) {
                    return Restangular
                        .all('auth/signup')
                        .post(params)
                        .then(function(response) {
                            saveUserAndToken(response.token);
                        });
                },
                signin: function(params) {
                          return Restangular
                        .all('users/login')
                        //.customGET('',params)
                        .get('',params)
                        .then(function(response) {
                            console.log(response.token);
                            saveUserAndToken(response.token);
                        });
                },
                signout: function() {
                    return Restangular
                        .one('auth/signout')
                        .get()
                        .then(function(){
                            currentUser = null;
                            Token.remove();
                        });
                },
                isAuthenticated: function() {
                    return !!Token.get();
                },
                getCurrentUser: function() {
                    return currentUser || localStorageService.get('user')
                }
            };
        };
    }

    angular
        .module('app.core')
        .provider('Authentication', AuthenticationProvider);
})();
