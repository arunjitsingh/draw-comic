/*
  JQUERY PLUGINS
  Copyright © 2010, Arunjit Singh (@arunjitsingh)
*/

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

      elt.dblclick(startEditing);
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
          opts.finishedEditing();
        }
        return false;
      }

      if (opts.autoStart) {
        startEditing();
      }
    }
    
    this.each(editable);
    
    return this;
  };
  
})(jQuery);