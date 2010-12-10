(function() {
  function hashCheck() {
    if (window.location.hash) {
      var pid = window.location.hash;
      pid = pid.substring(1);
      if (DC.APP.project && DC.APP.project.id === pid) return;
      DC.APP.trigger("open", [pid]);
    }
  }
  
  window.onhashchange = hashCheck;
  hashCheck();
  
})();