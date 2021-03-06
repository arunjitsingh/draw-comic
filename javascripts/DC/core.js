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

core.js: Draw-Comic's namespace and global objects
*/
(function(/*jQuery*/$, /*underscore*/_){
  
  var json = JSON.stringify;
  var parseJS = JSON.parse;
  
  /*Namespace object DC*/
  window.DC = {};
  
  DC.$ = $({});  // for jQuery's eventing system
  
  DC.USER = {};
  
  DC.viewRoot = $("#application");
  
  DC.db = $.couch.db('draw-comic');
  
  DC.offlineStore = {
    name: "draw-comic",
    handle: "dc",
    use: false,
    saveDoc: function(doc) {
      if ('localStorage' in window) {
        window.localStorage.setItem(DC.offlineStore.name, json(doc));
        window.localStorage.setItem(DC.offlineStore.handle, json(true));
        return true;
      }
    },
    openDoc: function(doc) {
      if ('localStorage' in window) {
        return window.localStorage.getItem(this.name);
      }
      return null;
    }
  };
  
  
  DC.__uid = 0;
  DC.uid = function() {
    return "dc" + Math.floor(DC.__uid += Math.random()*1000);
  };

  DC.URLREGEX = 
    /^https?:\/\/[a-zA-Z0-9.\-]+\.[a-z]{2,3}\/([\/a-zA-Z0-9\-._])*[a-zA-Z0-9\-._]+\.(jpe?g|png|bmp)$/g;
  
  DC.EMAILREGEX = /^[a-zA-Z][a-zA-Z0-9._]*@[a-zA-Z0-9][a-zA-Z0-9._\-]*[a-z]{2,3}$/g;
  
  DC.GoogleImageSearch = "GOOGLE";
  DC.UserUploadImageSearch = "UPLOAD";
  DC.UserBitmapImageSearch = "BITMAP";
  
  DC.ImageSearchCallback = function(elt, callback, type) {
    return function(data) {
      var images = [];
      if (type === DC.GoogleImageSearch || data.responseData) {
        images = data.responseData.results;
      } else if (type === DC.UserUploadImageSearch 
                || type === DC.UserBitmapImageSearch
                || data.rows) {
        var results = data.rows;
        _.each(results, function(row) {
          //row.id, row.key, []row.value
          _.each(row.value, function(imgsrc) {
            var image = {};
            image.url = (type === DC.UserUploadImageSearch ? DC.db.uri + row.id + "/" : "") + imgsrc;
            image.tbUrl = image.url;
            image.title = (type === DC.UserUploadImageSearch ? imgsrc : row.id);
            images.push(image);
          });
        });
      }
      if (!images.length) {
        elt.empty().append('<div style="color:#AAA;text-align:center">No Images</div>');
        return;
      }
      var frag = document.createDocumentFragment();
      $.each(images, function(i, image) {
        var img = new Image;
        img.data = {};
        img.src = image.tbUrl;
        img.data.URL = image.url;
        img.title = image.title;
        img.setAttribute("height", "160");
        frag.appendChild(img);
      });
      elt.empty().append(frag);
      callback();
    };
  };
  
})(window.jQuery, window._);