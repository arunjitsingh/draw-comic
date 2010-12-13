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

google.js: My fixup for accessing Google's Search APIs
*/

(function($) {
  
  window._GOOG = window.GOOG;
  
  window.GOOG = $({});
  
  GOOG.bind({
    "image-search": function(evt, keyword, elt, callback) {
      console.log("Searching Google for:", keyword);
      var baseURL = "https://ajax.googleapis.com/ajax/services/search/images";
      keyword = encodeURI(keyword);
      $.getJSON(baseURL + '?q='+keyword+'&v=1.0&imgsz=medium&rsz=8&as_filetype=png&callback=?', 
        DC.ImageSearchCallback(elt, callback, DC.GoogleImageSearch)
      );
    }
  });
  
})(jQuery);