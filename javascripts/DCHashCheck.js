(function() {
  if (window.location.hash) {
    var pid = window.location.hash;
    pid = pid.substring(1);
    DC.APP.trigger("open", [pid]);
  }
})();