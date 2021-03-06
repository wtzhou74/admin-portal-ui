/**
 * Created by tomson.ngassa on 12/14/2015.
 */

(function () {

    'use strict';

    angular
        .module('app.account')
        .config(SecurityConfig);

    /* @ngInject */
    function SecurityConfig($stateProvider) {

        $stateProvider
            .state('fe.login', {
                url: "/login",
                data: {pageTitle: 'Login'},
                templateUrl: "app/account/controllers/login.html",
                controllerAs: "loginVm",
                controller: 'LoginController'
            });
    }
})();