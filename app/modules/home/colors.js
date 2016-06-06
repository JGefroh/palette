(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('colors', Directive);
  function Directive() {
    function Controller() {
      var vm = this;
      vm.colors = [
        {label: 'Turquoise', hex: '#1abc9c'},
        {label: 'Green Sea', hex: '#16a085'},
        {label: 'Emerald', hex: '#2ecc71'},
        {label: 'Nephritis', hex: '#27ae60'},
        {label: 'Lime Green', hex: '#32cd32'},
        {label: 'Peter River', hex: '#3498db'},
        {label: 'Belize Hole', hex: '#2980b9'},
        {label: 'Amethyst', hex: '#9b59b6'},
        {label: 'Wisteria', hex: '#8e44ad'},
        {label: 'Wet Asphalt', hex: '#34495e'},
        {label: 'Midnight Blue', hex: '#2c3e50'},
        {label: 'Yellow', hex: '#ffff00'},
        {label: 'Sun Flower', hex: '#f1c40f'},
        {label: 'Orange', hex: '#f39c12'},
        {label: 'Carrot', hex: '#e67e22'},
        {label: 'Pumpkin', hex: '#d35400'},
        {label: 'Alizarin', hex: '#e74c3c'},
        {label: 'Pomegranate', hex: '#c0392b'},
        {label: 'Clouds', hex: '#ecf0f1'},
        {label: 'Silver', hex: '#bdc3c7'},
        {label: 'Concrete', hex: '#95a5a6'},
        {label: 'Abestos', hex: '#7f8c8d'},
        {label: 'Pure White', hex: '#FFFFFF'},
        {label: 'Pure Black', hex: '#000000'}
      ];

      vm.selectColor = function(color) {
        vm.color = color;
      };

      vm.selectColor(vm.colors[0]);
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
      }
    };
  }
})();
