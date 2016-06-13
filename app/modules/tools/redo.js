(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('redo', Directive);
  function Directive() {
    function Controller($rootScope) {
      var vm = this;
      vm.trigger = function() {
        $rootScope.$broadcast('tool:redo:request');
      };
    }

    return {
      restrict: 'AE',
      template: '<button class="tool" data-ng-click="vm.trigger();"><span class="fa fa-fw fa-repeat"></span></button>',
      controller: ['$rootScope', Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {}
    };
  }
})();
