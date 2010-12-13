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
*/
(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    text: "",
    x: 0,
    y: 0,
    z: 0,
    width: 200,
    height: 50
  };
  
  DC.Text = {};
  DC.Text.create = function(data) {
    var text = {};
    _.extend(text, kDefaults, data || {});
    return text;
  };
  
  DC.Text.convert = function(text) {
    return {
      text: text.text,
      x: text.x,
      y: text.y,
      z: text.z,
      width: text.width,
      height: text.height
    };
  };
  
  DC.TextView = {};
  DC.TextView.create = function(text) {
    var node = $("#load-box .text-line").first().clone();
    node.attr({width: text.width, height: text.height});
    node.css({position: 'absolute', top: text.y, left: text.x});
    node.data(text);
    return node;
  };
  
})(window.DC);