(function () {
  var analyticsProvider = '{!analytics_provider!}';

  angular
    .module('palette',
    [
        'ui.router',
        'palette.home'
    ])
    .constant('baseImagePath', '/images/')
    .config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise('/');
    }])
    .controller('ApplicationController', ['$rootScope', '$state', '$anchorScroll', 'ToolsService', ApplicationController]);

    function ApplicationController($rootScope, $state, $anchorScroll, ToolsService) {
      var vm = this;
    }
})();
