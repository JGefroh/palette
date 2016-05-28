(function() {
  angular
    .module('palette.home')
    .factory('Rectangle', Service);

    function Service() {
      var service = this;
      return {
        label: 'Rectangle',
        onDraw: onDraw,
        onClick: onClick
      };
    }
})();
