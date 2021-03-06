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
    bitmap: "",
    x: 0,
    y: 0,
    z: 0,
    width: 300,
    height: 300
  };
  var kDefaultContext = {
    strokeStyle: "#000000",
    lineWidth: 1.0
  };
  
  DC.Layer = {};
  DC.Layer.create = function(data) {
    var layer = {};
    _.extend(layer, kDefaults, data || {});
    return layer;
  };
  DC.Layer.convert = function(layer) {
    return {
      bitmap: layer.bitmap,
      x: layer.x,
      y: layer.y,
      z: layer.z,
      width: layer.width,
      height: layer.height
    };
  };
  
  
  DC.LayerView = {};
  DC.LayerView.create = function(layer) {
    
    var node = $("#load-box .layer").first().clone();
    node.attr({width: layer.width,height: layer.height});
    node.css({position: 'absolute', top: layer.y, left: layer.x});
    
    //node._index = DC.APP.newLayerIndex();

    if (layer.bitmap) {
      var img = new Image();
      img.src = layer.bitmap;
      img.onload = function() {
        var cvs = node.is("canvas") ? node[0] : node.find("canvas").first()[0];
        var ctx = cvs.getContext('2d');
        cvs.setAttribute("width", img.width);
        cvs.setAttribute("height", img.height);
        _.extend(layer, {width: img.width, height:img.height});
        var ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          layer.bitmap = cvs.toDataURL("image/png");
        } catch(e) {console.error("Could not convert to DataURL", e);}
        //console.log(layer.bitmap);
        var data = node.data();
        _.extend(data, layer);
        node.data(data);
      };
    }
    node[0]._uid = DC.uid();
    node.data(layer);
    return node;
  };
  
})(window.DC);