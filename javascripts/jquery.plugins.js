(function($){
  /**
  * Get the mouse position relative to the element
  */
  if (typeof($.mouse) !== 'undefined') {$._oldMouse = $.mouse;}
  $.mouse = function(evt, elt) {
    if (typeof(evt)==='undefined'){throw new Error("Invalid MouseEvent");}
    var x,              // x-coord
      y,                // y-coord
      doc = document;   // local copy of window.document
    elt = elt || evt.target;
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