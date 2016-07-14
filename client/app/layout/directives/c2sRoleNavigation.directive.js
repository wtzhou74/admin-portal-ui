/**
 * Created by jiahao.li on 7/14/2016.
 */

(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('c2sRoleNavigation', c2sRoleNavigation);

    /* @ngInject */
    function c2sRoleNavigation() {
        var directive = {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/layout/directives/roleNavigation.html',
            controllerAs: 'roleNavigationVm',
            controller: RoleNavigationController
        };

        return directive;

        /* @ngInject */
        function RoleNavigationController(oauthTokenService, oauthConfig) {
            var vm = this;
            vm.isAdmin = oauthTokenService.hasScope(oauthConfig.adminScope);
            vm.isProvider = oauthTokenService.hasScope(oauthConfig.providerScope);
        }
    }
})();