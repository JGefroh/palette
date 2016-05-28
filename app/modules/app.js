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
      vm.palette = {
        tools: []
      };
      vm.palette.tools = ToolsService.getTools();

      vm.selectedTool = vm.palette.tools[1];

      vm.emit = function(event) {
        $rootScope.$broadcast(event);
      };
    }
})();
