(function () {
  var analyticsProvider = '{!analytics_provider!}';

  angular
    .module('palette',
    [
        'ui.router',
        'palette.draw'
    ])
    .constant('baseImagePath', '/images/')
    .config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise('/');
    }]);
})();
