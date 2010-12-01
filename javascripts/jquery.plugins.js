/*
  JQUERY PLUGINS
  Copyright © 2010, Arunjit Singh (@arunjitsingh)
*/


(function($) {
  $.fn.centerBox = function() {
    return this.each(function() {
      var s = this.style;
      s.left = (($(window).width() - $(this).width()) / 2) + "px";
      s.top = (($(window).height() - $(this).height()) / 2) + "px";
    });
  };
})(jQuery);


//////////////////////////////////////////////////////////////////////////////
/**
* Get the mouse position relative to the element
*/
(function($) {

  $.GET = $.getJSON;

  $.POST = function(uri, data, callback) {
    return $.post(uri, data, callback, 'json');
  };

  $.PUT = function(uri, data, callback) {
    if ($.isFunction(data)) {
      callback = data;
      data = {};
    }
    return $.post(uri, $.extend(data, { _method: 'put' }), callback, 'json');
  };
  
  $.DEL = function(uri, data, callback) {
    if ($.isFunction(data)) {
      callback = data;
      data = {};
    }
    return $.post(uri, $.extend(data, { _method: 'delete' }), callback, 'json');
  };
})(jQuery);


//////////////////////////////////////////////////////////////////////////////
/**
* Get the mouse position relative to the element
*/
(function($) {
  if (typeof($.mouse) !== 'undefined') {$._oldMouse = $.mouse;}
  if (typeof($.fn.mouse) !== 'undefined') {$.fn._oldMouse = $.fn.mouse;}
  $.mouse = function(evt, elt) {
    if (typeof(evt)==='undefined'){throw new Error("Invalid MouseEvent");}
    var x,              // x-coord
      y,                // y-coord
      doc = document;   // local copy of window.document
    elt = $(elt)[0] || evt.target;
    if (typeof(evt.offsetX)!=='undefined' && typeof(evt.offsetY)!=='undefined') {
      x = evt.offsetX;
      y = evt.offsetY;
    } else {
      if (typeof(evt.layerX)!=='undefined' && typeof(evt.layerY)!=='undefined') {
        x = evt.layerX;
        y = evt.layerY;
      } else if (typeof(evt.pageX)!=='undefined' && typeof(evt.pageY)!=='undefined') {
        x = evt.pageX;
        y = evt.pageY;
      } else {
        x = evt.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;
        y = evt.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
      }
      x -= $(elt)[0].offsetLeft;
      y -= $(elt)[0].offsetTop;
    }
    return {'x':x, 'y':y};
  };
  
  $.fn.mouse = function(evt) {
    return $.mouse(evt, this);
  };
})(jQuery);


//////////////////////////////////////////////////////////////////////////////
/**
 * editable: For DIV elements in browsers supporting contenteditable
 */
(function($) {
  if (typeof($.editable) !== 'undefined') {$._oldEditable = $.editable;}
  if (typeof($.fn.editable) !== 'undefined') {$.fn._oldEditable = $.fn.editable;}
  
  $.editable = {};
  $.editable.defaults = {
    finishedEditing: function() {},
    autoStart: false,
    toolTip: "Double Click to Edit"
  };
  
  $.fn.editable = function(options) {
    var opts = $.extend({}, $.editable.defaults, options);
    function editable() {
      var elt = $(this);

      elt.bind('dblclick.edit', startEditing);
      elt.blur(stopEditing);
      elt.addClass("editable");
      elt.attr("title", opts.toolTip);

      function startEditing() {
        elt.attr("contenteditable", "true");
        elt.addClass("editing");
        elt.focus();
        return false;
      }

      function stopEditing() {
        elt.attr("contenteditable", "false");
        elt.removeClass("editing");
        if ($.isFunction(opts.finishedEditing)) {
          opts.finishedEditing.call(this);
        }
        return false;
      }

      if (opts.autoStart) {
        startEditing();
      }
    }
    
    return this.each(editable);
  };
  
})(jQuery);


//////////////////////////////////////////////////////////////////////////////
/**
 * drawable: For CANVAS elements only
 */
(function($) {
  if (typeof($.drawable) !== 'undefined') {$._oldDrawable = $.drawable;}
  if (typeof($.fn.drawable) !== 'undefined') {$.fn._oldDrawable = $.fn.drawable;}
  
  $.drawable = {};
  $.drawable.defaults = {};
  $.fn.drawable = function(options) {
    var drawable = function(options) {
      var canvas = $(this);
      if (canvas.is("canvas")) {
        
        canvas.isDrawable = false;
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
          //console.log(evt, "Down:", p);
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
          //console.log(evt, "Move:", p);
        };

        var mouseUp = function(evt) {
          evt.preventDefault();
          isDrawing = false;
          //console.log(evt, "Up:", $(canvas).mouse(evt));
        };
        
        if (options.enable || !options.disable) {
          try {
            canvas.draggable('disable');
          } catch(e) {}
          canvas.addClass("drawable");
          canvas.bind({
            'mousedown.draw': mouseDown,
            'mouseup.draw': mouseUp,
            'mousemove.draw': mouseMove
          });
        } else if (options.disable || !options.enable) {
          canvas.removeClass("drawable");
          canvas.unbind('mousedown.draw');
          canvas.unbind('mouseup.draw');
          canvas.unbind('mousemove.draw');
          try {
            canvas.draggable('enable');
          } catch(e) {}
          var data = canvas.data();
          data.bitmap = canvas[0].toDataURL();
          canvas.data(data);
        }
      } else {
        throw new Error("Only <canvas> elements are drawable!");
      }
    };
    
    this.each(function() {
      drawable.call(this, options);
    });
    
    return this;
  };
  
})(jQuery);