(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('undo', Directive);
  function Directive() {
    function Controller($rootScope) {
      var vm = this;
      vm.trigger = function() {
        $rootScope.$broadcast('tool:undo:request');
      };
    }

    return {
      restrict: 'AE',
      template: '<button class="tool" data-ng-click="vm.trigger();"><span class="fa fa-fw fa-undo"></span></button>',
      controller: ['$rootScope', Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {}
    };
  }
})();
