(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('paper', Directive);
  function Directive() {
    function Controller() {
      var vm = this;
    }

    return {
      restrict: 'AE',
      templateUrl: 'paper.html',
      controller: [Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
        color: '='
      },
      link: function(scope, element, attributes) {
        var overlayCtx = element[0].children[0].getContext("2d");
        var drawingCtx = element[0].children[1].getContext("2d");
        var _DEFAULT_COLOR = 'black';
        var _DEFAULT_LINE_WIDTH = 10;
        var _previousStates = [];
        var _currentState = null;
        var _isMouseDown = false;

        function initialize() {
          resizeCanvas(drawingCtx);
          resizeCanvas(overlayCtx);
          initializeCanvasWatchers();
          initializeColorChangeWatcher();
          initializeCrayon();
          initializeTools();
          scope.vm.tool = scope.vm.tools[0];
        }

        function initializeColorChangeWatcher() {
          scope.$watch('vm.color', function(newColor) {
            if (newColor) {
              drawingCtx.strokeStyle = newColor.hex;
              overlayCtx.strokeStyle = newColor.hex;
              overlayCtx.fillStyle = newColor.hex;
            }
            else {
              drawingCtx.strokeStyle = _DEFAULT_COLOR;
              overlayCtx.strokeStyle = _DEFAULT_COLOR;
            }
          });
        }

        function initializeCanvasWatchers() {
          window.addEventListener('resize', resizeCanvas(overlayCtx), false);
          window.addEventListener('resize', resizeCanvas(drawingCtx), false);
          element.bind('mousedown', start);
          element.bind('mousemove', process);
          element.bind('mouseup', end);
        }

        function initializeCrayon() {
          drawingCtx.lineCap = 'round';
          drawingCtx.lineWidth = _DEFAULT_LINE_WIDTH;
        }

        function initializeTools() {
          scope.vm.tools = [
            {
              label: 'Pencil',
              start: function(coordinates) {
                drawingCtx.beginPath();
                drawingCtx.moveTo(coordinates.x, coordinates.y);
                _isMouseDown = true;
              },
              preProcess: function(coordinates) {
                overlayCtx.save();
                overlayCtx.fillStyle = "#FFFFFF";
                overlayCtx.fillRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
                overlayCtx.restore();
              },
              process: function(coordinates) {
                overlayCtx.beginPath();
                overlayCtx.arc(coordinates.x, coordinates.y, _DEFAULT_LINE_WIDTH / 2, 0, 2 * Math.PI, false);
                overlayCtx.fill();
                overlayCtx.stroke();
                if (_isMouseDown) {
                  drawingCtx.lineTo(coordinates.x, coordinates.y);
                  drawingCtx.stroke();
                }
              },
              end: function(coordinates) {
                drawingCtx.lineTo(coordinates.x, coordinates.y);
                drawingCtx.stroke();
                _isMouseDown = false;
              }
            }
          ];
        }

        //Tool Response
        function start(event) {
          event.preventDefault();
          scope.vm.tool.start(getMousePosition(event));
        }

        function process(event) {
          event.preventDefault();
          if (scope.vm.tool.preProcess) {
            scope.vm.tool.preProcess(getMousePosition(event));
          }
          scope.vm.tool.process(getMousePosition(event));
          if (scope.vm.tool.postProcess) {
            scope.vm.tool.postProcess(getMousePosition(event));
          }
        }

        function end(event) {
          event.preventDefault();
          scope.vm.tool.end(getMousePosition(event));
        }

        //Utils

        function resizeCanvas(context) {
          var drawing = context.getImageData(0,0, context.canvas.width, context.canvas.height);
          context.canvas.width  = window.innerWidth;
          context.canvas.height = window.innerHeight;
          context.putImageData(drawing, 0, 0);
        }

        function getMousePosition(event) {
          var bounds = drawingCtx.canvas.getBoundingClientRect();
          return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
          };
        }

        initialize();
      }
    };
  }
})();
