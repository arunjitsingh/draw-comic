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