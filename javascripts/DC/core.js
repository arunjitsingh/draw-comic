(function(/*jQuery*/$, /*underscore*/_){
  
  var json = JSON.stringify;
  var parseJS = JSON.parse;
  
  /*Namespace object DC*/
  window.DC = {};
  
  DC.$ = $({});  // uh-oh! need to use jQ's eventing system
  
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
    /^https?:\/\/[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]+\/([\/a-zA-Z0-9\-.])+?[a-zA-Z0-9\-.]+\.(jpe?g|png|bmp)$/;
  
})(window.jQuery, window._);