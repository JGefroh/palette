(function() {
  'use strict';
  angular
    .module('palette.home', [])
    .config(['$stateProvider', Routes]);

  function Routes($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'home.html'
    });
  }
})();
