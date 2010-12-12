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

//
// My own, Copyright ©2010, Arunjit Singh
//
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
}