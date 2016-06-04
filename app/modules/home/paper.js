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
      templateUrl: 'paper.html',
      controller: [Controller],
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      scope: {
      },
      link: function(scope, element, attributes) {
        var overlayCtx = element[0].children[1].children[1].getContext("2d");
        var drawingCtx = element[0].children[1].children[0].getContext("2d");

        var _previousStates = [];
        var _currentState = null;

        var isStarted = false;

        resizeCanvas(drawingCtx);
        resizeCanvas(overlayCtx);

        window.addEventListener('resize', resizeCanvas(overlayCtx), false);
        window.addEventListener('resize', resizeCanvas(drawingCtx), false);
        element.bind('mousedown', start);
        element.bind('mousemove', process);
        element.bind('mouseup', end);
        // scope.$on('undo', undo);



        var sharedData = {};
        var isMouseDown = false;
        drawingCtx.strokeStyle = 'black';
        scope.vm.tools = [
          {
            label: 'Pencil',
            start: function(coordinates) {
              drawingCtx.beginPath();
              drawingCtx.moveTo(coordinates.x, coordinates.y);
              isMouseDown = true;
            },
            process: function(coordinates) {
              if (isMouseDown) {
                drawingCtx.lineTo(coordinates.x, coordinates.y);
                drawingCtx.stroke();
              }
            },
            end: function(coordinates) {
              drawingCtx.lineTo(coordinates.x, coordinates.y);
              drawingCtx.stroke();
              isMouseDown = false;
            }
          },
          {
            label: 'Rectangle',
            data: {
              imageDataOnStart: null
            },
            start: function(coordinates) {
              this.data.coordinatesOnStart = coordinates;
              this.data.imageDataOnStart = overlayCtx.getImageData(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
              isMouseDown = true;
            },
            preProcess: function(coordinates) {
              if (isMouseDown) {
                overlayCtx.putImageData(this.data.imageDataOnStart, 0, 0);
              }
            },
            process: function(coordinates) {
              if (isMouseDown) {
                overlayCtx.beginPath();
                overlayCtx.rect(this.data.coordinatesOnStart.x, this.data.coordinatesOnStart.y, coordinates.x - this.data.coordinatesOnStart.x, coordinates.y -  this.data.coordinatesOnStart.y);
                overlayCtx.stroke();
              }
            },
            end: function(coordinates) {
              drawingCtx.beginPath();
              drawingCtx.rect(this.data.coordinatesOnStart.x, this.data.coordinatesOnStart.y, coordinates.x - this.data.coordinatesOnStart.x, coordinates.y -  this.data.coordinatesOnStart.y);
              drawingCtx.stroke();
              overlayCtx.putImageData(this.data.imageDataOnStart, 0, 0);
              this.data.imageDataOnStart = null;
              this.data.coordinatesOnStart = null;
              isMouseDown = false;
            }
          },
          {
            label: 'Select',
            data: {
              mode: 'selection'
            },
            start: function(coordinates) {
              if (sharedData.selectedRegion && isInRegion(coordinates.x, coordinates.y, sharedData.selectedRegion)) {
                sharedData.selectedRegion.image = getImageFromSelectedRegion();
                this.data.dragOffset = {
                  x: sharedData.selectedRegion.xMin - coordinates.x,
                  y: sharedData.selectedRegion.yMin - coordinates.y
                };
                this.data.mode = 'move';
                isMouseDown = true;
              }
              else {
                console.info("NOT IN REGION, SELECTING");
                if (this.data.overlayOnStart) {
                  overlayCtx.putImageData(this.data.overlayOnStart, 0, 0);
                }
                this.data.mode = 'selection';
                this.data.coordinatesOnStart = coordinates;
                this.data.overlayOnStart = overlayCtx.getImageData(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
                isMouseDown = true;
              }
            },
            preProcess: function(coordinates) {
              if (this.data.mode === 'selection') {
                if (isMouseDown) {
                  overlayCtx.putImageData(this.data.overlayOnStart, 0, 0);
                }
              }
              if (this.data.mode === 'move') {
                if (isMouseDown) {
                  overlayCtx.putImageData(this.data.overlayOnStart, 0, 0);
                }
              }
            },
            process: function(coordinates) {
              if (this.data.mode === 'selection') {
                if (isMouseDown) {
                  outlineRegion(this.data.coordinatesOnStart.x, this.data.coordinatesOnStart.y, coordinates.x - this.data.coordinatesOnStart.x, coordinates.y -  this.data.coordinatesOnStart.y);
                }
              }
              if (this.data.mode === 'move') {
                if (isMouseDown) {
                  overlayCtx.putImageData(sharedData.selectedRegion.image, coordinates.x + this.data.dragOffset.x, coordinates.y + this.data.dragOffset.y);
                  outlineRegion(coordinates.x + this.data.dragOffset.x, coordinates.y + this.data.dragOffset.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
                }
              }
            },
            end: function(coordinates) {
              if (this.data.mode === 'selection') {
                overlayCtx.putImageData(this.data.overlayOnStart, 0, 0);
                outlineRegion(this.data.coordinatesOnStart.x, this.data.coordinatesOnStart.y, coordinates.x - this.data.coordinatesOnStart.x, coordinates.y -  this.data.coordinatesOnStart.y);
                sharedData.selectedRegion = getAsRegion(coordinates.x, coordinates.y, this.data.coordinatesOnStart.x, this.data.coordinatesOnStart.y);
                this.data.coordinatesOnStart = null;
                isMouseDown = false;
              }
              if (this.data.mode === 'move') {
                overlayCtx.putImageData(this.data.overlayOnStart, 0, 0);
                drawingCtx.putImageData(sharedData.selectedRegion.image, coordinates.x + this.data.dragOffset.x, coordinates.y + this.data.dragOffset.y);
                sharedData.selectedRegion = getAsRegion(coordinates.x + this.data.dragOffset.x,
                                                        coordinates.y + this.data.dragOffset.y,
                                                        coordinates.x + this.data.dragOffset.x + sharedData.selectedRegion.width,
                                                        coordinates.y + this.data.dragOffset.y + sharedData.selectedRegion.height);
                outlineRegion(coordinates.x + this.data.dragOffset.x, coordinates.y + this.data.dragOffset.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
                isMouseDown = false;
              }
            }
          }
        ];
        scope.vm.tool = scope.vm.tools[2];

        function getImageFromSelectedRegion() {
          return drawingCtx.getImageData(sharedData.selectedRegion.xMin, sharedData.selectedRegion.yMin, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
        }

        function outlineRegion(x, y, width, height) {
          overlayCtx.save();
          overlayCtx.setLineDash([2, 3]);
          overlayCtx.beginPath();
          overlayCtx.rect(x, y, width, height);
          overlayCtx.stroke();
          overlayCtx.restore();
        }

        function isInRegion(x, y, region) {
          if (x < region.xMin || x > region.xMax || y < region.yMin || y > region.yMax) {
            return false;
          }
          return true;
        }

        function isInRegionBorder(x, y, region) {
        }

        function getAsRegion(x1, y1, x2, y2) {
          return {
            xMin: Math.min(x1, x2),
            yMin: Math.min(y1, y2),
            xMax: Math.max(x1, x2),
            yMax: Math.max(y1, y2),
            width: Math.abs(Math.abs(x1) - Math.abs(x2)),
            height: Math.abs(Math.abs(y1) - Math.abs(y2))
          };
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
          var bounds = element[0].children[0].getBoundingClientRect();
          return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
          };
        }
      }
    };
  }
})();
