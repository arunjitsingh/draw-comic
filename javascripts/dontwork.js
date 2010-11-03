
//////////////////////////////////////////////////////////////////////////////
/**
 * drawable: For CANVAS elements only
 */
(function($) {
  if (typeof($.drawable) !== 'undefined') {$._oldDrawable = $.drawable;}
  if (typeof($.fn.drawable) !== 'undefined') {$.fn._oldDrawable = $.fn.drawable;}
  
  $.drawable = {};
  $.drawable.defaults = {
    toolbarDOM: "<div class='drawable-toolbar'>Color:<input class='strokeStyle'>Line:<input class='lineWidth'></div>"
  };
  $.fn.drawable = function(options) {
    function drawable() {
      var canvas = $(this);
      if (canvas.is("canvas")) {
        canvas.addClass("drawable");
        var context = canvas[0].getContext("2d");
        var isDrawing = false;
        context.strokeStyle = "#000000";
        
        var mouseDown = function(evt) {
          evt.preventDefault();
          isDrawing = true; 
          context.beginPath();
          var p = $(canvas).mouse(evt),
            x = p.x,
            y = p.y;
          context.moveTo(x, y);
          console.log(evt, "Down:", p);
        };

        var mouseMove = function(evt) {
          evt.preventDefault();
          var p = $(canvas).mouse(evt),
            x = p.x,
            y = p.y;
          if (isDrawing) {
            context.lineTo(x, y);
            context.stroke();
          }
          console.log(evt, "Move:", p);
        };

        var mouseUp = function(evt) {
          evt.preventDefault();
          isDrawing = false;
          console.log(evt, "Up:", $(canvas).mouse(evt));
        };

        canvas.bind({
          'mousedown': mouseDown,
          'mouseup': mouseUp,
          'mousemove': mouseMove
        });
      } else {
        throw new Error("Only <canvas> elements are drawable!");
      }
    }
    
    this.each(drawable);
    
    return this;
  };
})(jQuery);