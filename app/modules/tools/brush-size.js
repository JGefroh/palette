(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('brushSize', Directive);
  function Directive() {
    function Controller($rootScope) {
      var vm = this;
      vm.trigger = function(size) {
        $rootScope.$broadcast('tool:brush:resize', size);
        vm.selectedSize = size;
      };
    }

    return {
      restrict: 'AE',
      template: '<button class="tool" data-ng-click="vm.trigger(vm.size);" data-ng-class="{\'active\': vm.selectedSize === vm.size}"><span class="fa fa-fw fa-circle"></span> {{::vm.size}}</button>',
      controller: ['$rootScope', Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
        size: '=',
        selectedSize: '=?'
      }
    };
  }
})();
