(function() {
  angular
    .module('palette.home')
    .service('ToolsService', Service);

    function Service() {
      var service = this;
      var tools = [
        {
          label: 'pencil',
          start: function(ctx, coordinates) {
            ctx.beginPath();
          },
          process: function(ctx, coordinates) {
            ctx.lineTo(coordinates.x, coordinates.y);
            ctx.stroke();
          }
        },
        {
          label: 'rectangle',
          data: {},
          start: function(ctx, coordinates) {
            this.data.preOutline = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.data.startX = coordinates.x;
            this.data.startY = coordinates.y;
          },
          preProcess: function(ctx, coordinates) {
            ctx.putImageData(this.data.preOutline, 0, 0);
          },
          process: function(ctx, coordinates) {
            ctx.beginPath();
            ctx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            ctx.stroke();
            ctx.closePath();
          },
          end: function(ctx, coordinates) {
            ctx.beginPath();
            ctx.rect(this.data.startX, this.data.startY, coordinates.x - this.data.startX, coordinates.y - this.data.startY);
            ctx.stroke();
          }
        },
        {
          label: 'stamp',
          end: function(ctx, coordinates) {
            ctx.beginPath();
            ctx.rect(coordinates.x, coordinates.y, 100, 100);
            ctx.stroke();
          }
        }
      ];


      service.getTools = function() {
        return tools;
      };
    }
})();
