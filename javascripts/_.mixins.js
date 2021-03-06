/*
Draw-Comic: An online drawing and sharing application.
Copyright (C) 2010  Arunjit Singh

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

_.mixins.js: My mix-ins for to the Underscore.js library
*/
// MY MIXINS

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
});