(function($) {
  
  window._GOOG = window.GOOG;
  
  window.GOOG = $({});
  
  GOOG.bind({
    "image-search": function(evt, keyword, elt, callback) {
      console.log("searching Google");
      var baseURL = "https://ajax.googleapis.com/ajax/services/search/images";
      keyword = encodeURI(keyword);
      $.getJSON(baseURL + '?q='+keyword+'&v=1.0&imgsz=medium&rsz=8&as_filetype=png&callback=?', 
        function(data) {
          var images = data.responseData.results;
          var frag = document.createDocumentFragment();
          $.each(images, function(i, image) {
            var img = new Image;
            img.src = image.url;
            img.setAttribute("height", "160");
            frag.appendChild(img);
          });
          elt.empty().append(frag);
          callback();
        }
      );
    }
  });
  
})(jQuery);