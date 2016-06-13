(function() {
  'use strict';
  angular
    .module('palette.draw')
    .directive('paper', Directive);
  function Directive() {
    function Controller($rootScope) {
      var vm = this;
      $rootScope.$on('', function() {

      });
    }

    return {
      restrict: 'AE',
      templateUrl: 'paper.html',
      controller: ['$rootScope', Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
        color: '='
      },
      link: function(scope, element, attributes) {
        var overlayCtx = element[0].children[0].getContext("2d");
        var drawingCtx = element[0].children[1].getContext("2d");
        var _history = [];
        var _future = [];
        var _DEFAULT_COLOR = 'black';
        var _DEFAULT_LINE_WIDTH = 10;
        var _lineWidth = _DEFAULT_LINE_WIDTH;
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
          initializeListeners();
          scope.vm.tool = scope.vm.tools[0];
        }

        function initializeListeners() {
          scope.$on('tool:undo:request', undo);
          scope.$on('tool:redo:request', redo);
          scope.$on('tool:brush:resize', resizeBrush);
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
          drawingCtx.lineWidth = _lineWidth;
        }

        function initializeTools() {
          scope.vm.tools = [
            {
              label: 'Pencil',
              start: function(coordinates) {
                if (!_isMouseDown) {
                  saveState(_history);
                  branchFuture();
                  drawingCtx.beginPath();
                  drawingCtx.moveTo(coordinates.x, coordinates.y);
                }
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
                overlayCtx.arc(coordinates.x, coordinates.y, _lineWidth / 2, 0, 2 * Math.PI, false);
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

        function dispatch(event) {
          if (event.keyCode > 48 && event.keyCode <= 57) {
            _lineWidth = (event.keyCode - 48) * 5;
            drawingCtx.lineWidth = _lineWidth;
          }
          else if (event.keyCode === 48) {
            _lineWidth = _DEFAULT_LINE_WIDTH;
            drawingCtx.lineWidth = _lineWidth;
          }
        }

        function resizeBrush(event, size) {
          _lineWidth = size;
          if (!size) {
            _lineWidth = _DEFAULT_LINE_WIDTH;
          }
          drawingCtx.lineWidth = _lineWidth;
        }
        //Utils

        function branchFuture() {
          _future = [];
        }

        function undo() {
          if (_history.length) {
            var previousState = _history.pop();
            saveState(_future);
            drawingCtx.putImageData(previousState, 0, 0);
          }
        }

        function redo() {
          if (_future.length) {
            var nextState = _future.pop();
            saveState(_history);
            drawingCtx.putImageData(nextState, 0, 0);
          }
        }

        function saveState(where) {
          where.push(getState(drawingCtx));
        }

        function getState(context) {
          return context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        }

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
