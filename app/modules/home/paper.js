(function() {
  'use strict';
  angular
    .module('palette.home')
    .directive('paper', Directive);
  function Directive() {
    function Controller() {
      var vm = this;
    }

    return {
      restrict: 'AE',
      template: '<canvas class="paper"></canvas>',
      controller: [Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
        color: '=',
        tool: '='
      },
      link: function(scope, element, attributes) {
        var ctx = element[0].getContext("2d");

        var _previousStates = [];
        var _currentState = null;

        var isStarted = false;

        resizeCanvas();

        window.addEventListener('resize', resizeCanvas, false);
        element.bind('mousedown', start);
        element.bind('mousemove', process);
        element.bind('mouseup', end);
        scope.$watch('vm.color', setColor, true);
        scope.$on('undo', undo);

        //Tool Response
        function start(event) {
          event.preventDefault();
          snapshotImage();
          isStarted = true;
          if (scope.vm.tool.start) {
            scope.vm.tool.start(ctx, getMousePosition(event));
          }
        }

        function process(event) {
          event.preventDefault();
          if (isStarted) {
            if (scope.vm.tool.preProcess) {
              scope.vm.tool.preProcess(ctx, getMousePosition(event));
            }

            if (scope.vm.tool.process) {
              scope.vm.tool.process(ctx, getMousePosition(event));
            }

            if (scope.vm.tool.postProcess) {
              scope.vm.tool.postProcess(ctx, getMousePosition(event));
            }
          }
        }

        function end(event) {
          event.preventDefault();
          isStarted = false;
          if (scope.vm.tool.end) {
            scope.vm.tool.end(ctx, getMousePosition(event));
          }
        }


        function setColor(color) {
          if (color) {
            ctx.strokeStyle = color.hex;
          }
          else {
            ctx.strokeStyle = 'black';
          }
        }

        function undo() {
          var stateToRestore = _previousStates[0];
          if (_previousStates.length > 1) {
            stateToRestore = _previousStates.pop();
          }
          restoreImage(stateToRestore);
        }

        function snapshotImage() {
          _previousStates.push(getCurrentImage());
        }

        function restoreImage(data) {
          ctx.putImageData(data, 0, 0);
        }

        function getCurrentImage() {
          return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        function resizeCanvas() {
          var drawing = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
          ctx.canvas.width  = window.innerWidth;
          ctx.canvas.height = window.innerHeight;
          restoreImage(drawing);
        }

        function getMousePosition(event) {
          var bounds = element[0].getBoundingClientRect();
          return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
          };
        }
      }
    };
  }
})();
