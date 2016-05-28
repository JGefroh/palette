(function() {
  'use strict';
  angular
    .module('palette.home')
    .directive('colors', Directive);
  function Directive() {
    function Controller() {
      var vm = this;
      vm.colors = [
        {label: 'Black', hex: 'black'},
        {label: 'Red', hex: 'red'},
        {label: 'Green', hex: 'green'},
        {label: 'Blue', hex: 'blue'},
        {label: 'Yellow', hex: 'yellow'},
        {label: 'Purple', hex: 'purple'},
        {label: 'Brown', hex: 'brown'}
      ];

      vm.selectColor = function(color) {
        vm.color = color;
      };
    }

    return {
      restrict: 'AE',
      templateUrl: 'colors.html',
      controller: [Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
        color: '='
      },
      link: function(scope, element, attributes) {
      }
    };
  }
})();
