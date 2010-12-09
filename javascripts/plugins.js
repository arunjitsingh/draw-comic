/**
* Thanks to Doug Crockford for some of these (javascript.crockford.com)
*/
function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (typeof value.length === 'number' &&
      !(value.propertyIsEnumerable('length')) &&
      typeof value.splice === 'function') {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

function isEmpty(o) {
  var i, v;
  if (typeOf(o) === 'object') {
    for (i in o) {
      v = o[i];
      if (v !== undefined && typeOf(v) !== 'function') {
        return false;
      }
    }
  }
  return true;
}

if (!String.prototype.entityify) {
  String.prototype.entityify = function () {
    return this.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g, "&gt;");
  };
}

if (!String.prototype.quote) {
  String.prototype.quote = function () {
    var c, i, l = this.length, o = '"';
    for (i = 0; i < l; i += 1) {
      c = this.charAt(i);
      if (c >= ' ') {
        if (c === '\\' || c === '"') {
          o += '\\';
        }
        o += c;
      } else {
        switch (c) {
          case '\b':
          o += '\\b';
          break;
          case '\f':
          o += '\\f';
          break;
          case '\n':
          o += '\\n';
          break;
          case '\r':
          o += '\\r';
          break;
          case '\t':
          o += '\\t';
          break;
          default:
          c = c.charCodeAt();
          o += '\\u00' + Math.floor(c / 16).toString(16) +
          (c % 16).toString(16);
        }
      }
    }
    return o + '"';
  };
} 

if (!String.prototype.supplant) {
  String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
  };
}

// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
if (!String.prototype.camelize) {
  String.prototype.camelize = function camelize() {
    var ret = this.replace(/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g, 
      function(str,separater,character) { 
        return (character) ? character.toUpperCase() : '' ;
      }) ;
    var first = ret.charAt(0), lower = first.toLowerCase() ;
    return (first !== lower) ? (lower + ret.slice(1)) : ret ;
  };
}

// if (!String.prototype.trim) {
//   String.prototype.trim = function trim() {
//     return this.replace(/^\s+|\s+$/g,"");
//   } ;
// }

if (!String.prototype.fmt) {
  String.prototype.fmt = function fmt() {
    // first, replace any ORDERED replacements.
    var args = arguments;
    var idx  = 0; // the current index for non-numerical replacements
    return this.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0)-1 : idx++ ;
      s =args[argIndex];
      return ((s===null) ? '(null)' : (s===undefined) ? '' : s).toString(); 
    }) ;
  } ;
}

if (!Array.prototype.uniq) {
  Array.prototype.uniq = function uniq() {
    var ret = [], len = this.length, item, idx ;
    for(idx=0;idx<len;idx++) {
      item = this[idx];
      if (ret.indexOf(item) < 0) ret.push(item);
    }
    return ret ;
  };
}

if (!String.prototype.w) {
  String.prototype.w = function w() { 
    var ary = [], ary2 = this.split(' '), len = ary2.length ;
    for (var idx=0; idx<len; ++idx) {
      var str = ary2[idx] ;
      if (str.length !== 0) ary.push(str) ; // skip empty strings
    }
    return ary ;
  };
}

// My own, Copyright ©2010, Arunjit Singh
if (!Number.partition) {
  Number.partition = function partition(number, parts) {
    var ret = [];
    var div = Math.floor(number/parts),
      rem = number % parts;
    for (var i = 0; i < parts; ++i) {
      ret[i] = div + ((rem-- > 0) ? 1 : 0);
    }
    return ret;
  };
}

if (!Number.prototype.partition) {
  Number.prototype.partition = function partition(parts) {
    return Number.partition(this, parts);
  };
}

if (!String.prototype.truncate) {
  String.prototype.truncate = function truncate(l) {
    return this.slice(0, l);
  };
}

if (!String.partition) {
  String.partition = function partition(string, parts) {
    var words = string.w();
    var p = words.length.partition(parts),
      l = p.length,
      idx = 0;
    for (var i = 0; i < l-1; ++i) {
      idx += p[i];
      words.splice(idx, 0, "\n");
    }
    return words.join(" ");
  };
}
if (!String.prototype.partition) {
  String.prototype.partition = function partition(parts) {
    return String.partition(this, parts);
  };
}// MY MIXINS

_.mixin({
  state: function(object) {
    return JSON.parse(JSON.stringify(object));
  },
  
  cleanArray: function(object) {
    if (_.isArray(object)) {
      var len = object.length,
          i = 0;
      while (i < len) {
        var o = _(object[i]);
        if (o.isEmpty() || o.isUndefined() || o.isNaN() || o.isNull()) {
          object.splice(i, 1);
          i--;
          len--;
        }
        i++;
      }
    }
  },
  
  areEqual: function(o1, o2, allowempty) {
    allowempty = allowempty ? true : false;    
    return (allowempty && (o1 === o2)) || (!_.isEmpty(o1) && !_.isEmpty(o2) && (o1 === o2));
  }
});/*
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
          $(document).addClass("drawing-active");
          canvas.addClass("drawable");
          canvas.bind({
            'mousedown.draw': mouseDown,
            'mouseup.draw': mouseUp,
            'mousemove.draw': mouseMove
          });
        } else if (options.disable || !options.enable) {
          $(document).removeClass("drawing-active")
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

