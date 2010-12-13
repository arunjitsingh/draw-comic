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
    layers: [],
    texts: []
  };
  
  DC.Page = {};
  DC.Page.create = function(data) {
    var page = {};
    _.extend(page, kDefaults, data || {});
    return page;
  };
  DC.Page.convert = function(page) {
    return {
      layers: page.layers,
      texts: page.texts
    };
  };
  
  DC.PageView = {};
  DC.PageView.create = function(page) {
    var node = $("#load-box .page-container").first().clone();
    node.css({position: 'absolute', top: 0, left: 0});
    node.data(page);
    //node._index = DC.APP.newPageIndex();
    node[0]._uid = DC.uid();
    return node;
  };
  
  
})(window.DC);