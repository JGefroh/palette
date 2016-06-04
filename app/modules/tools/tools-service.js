(function() {
  angular
    .module('palette.home')
    .service('ToolsService', Service);

    function Service() {
      var service = this;

      var sharedData = {};

      function selectRegion(x, y, width, height) {
        sharedData.selectedRegion = {
          x: x,
          y: y,
          width: width,
          height: height
        };
      }

      function getImageFromSelectedRegion() {
        return drawingCtx.getImageData(sharedData.selectedRegion.x, sharedData.selectedRegion.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
      }

      function outlineRegion(x, y, width, height) {
        overlayCtx.beginPath();
        overlayCtx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
        overlayCtx.stroke();
        overlayCtx.closePath();
      }

      function isInRegion(x, y, region) {

      }

      function isInRegionBorder(x, y, region) {
      }


      var tools = [
        {
          label: 'pencil',
          start: function(overlayCtx, drawingCtx, coordinates) {
            drawingCtx.beginPath();
          },
          process: function(overlayCtx, drawingCtx, coordinates) {
            drawingCtx.lineTo(coordinates.x, coordinates.y);
            drawingCtx.stroke();
          }
        },
        {
          label: 'rectangle',
          data: {},
          start: function(overlayCtx, drawingCtx, coordinates) {
            this.data.preOutline = drawingCtx.getImageData(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
            this.data.startX = coordinates.x;
            this.data.startY = coordinates.y;
          },
          preProcess: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.putImageData(this.data.preOutline, 0, 0);
          },
          process: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.beginPath();
            overlayCtx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            overlayCtx.stroke();
            overlayCtx.closePath();
          },
          end: function(overlayCtx, drawingCtx, coordinates) {
            drawingCtx.beginPath();
            drawingCtx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            drawingCtx.stroke();
          }
        },
        {
          label: 'move',
          data: {},
          start: function(overlayCtx, drawingCtx, coordinates) {
            this.data.preOutline = overlayCtx.getImageData(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
            this.data.regionData = drawingCtx.getImageData(sharedData.selectedRegion.x, sharedData.selectedRegion.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
            drawingCtx.clearRect(sharedData.selectedRegion.x, sharedData.selectedRegion.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
          },
          preProcess: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.putImageData(this.data.preOutline, 0, 0);
          },
          process: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.putImageData(this.data.regionData, coordinates.x, coordinates.y);
          },
          end: function(overlayCtx, drawingCtx, coordinates) {
            drawingCtx.putImageData(this.data.regionData, coordinates.x, coordinates.y);
            sharedData.selectedRegion = {
              x: coordinates.x,
              y: coordinates.y,
              width: sharedData.selectedRegion.width,
              height: sharedData.selectedRegion.height
            };
            overlayCtx.beginPath();
            overlayCtx.rect(sharedData.selectedRegion.x, sharedData.selectedRegion.y, sharedData.selectedRegion.width, sharedData.selectedRegion.height);
            overlayCtx.stroke();
          }
        },
        {
          label: 'selection',
          ignoreSnapshot: true,
          data: {},
          start: function(overlayCtx, drawingCtx, coordinates) {
            this.data.preOutline = drawingCtx.getImageData(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
            this.data.startX = coordinates.x;
            this.data.startY = coordinates.y;
          },
          preProcess: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.putImageData(this.data.preOutline, 0, 0);
          },
          process: function(overlayCtx, drawingCtx, coordinates) {
            overlayCtx.setLineDash([5, 5]);
            overlayCtx.beginPath();
            overlayCtx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            overlayCtx.stroke();
            overlayCtx.closePath();
          },
          end: function(overlayCtx, drawingCtx, coordinates) {
            sharedData.selectedRegion = {
              x: this.data.startX,
              y: this.data.startY,
              width:  coordinates.x - this.data.startX,
              height: coordinates.y - this.data.startY
            };
            overlayCtx.beginPath();
            overlayCtx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            overlayCtx.stroke();
          }
        },
        {
          label: 'stamp',
          end: function(overlayCtx, drawingCtx, coordinates) {
            drawingCtx.beginPath();
            drawingCtx.rect(coordinates.x, coordinates.y, 100, 100);
            drawingCtx.stroke();
          }
        }
      ];


      service.getTools = function() {
        return tools;
      };
    }
})();
