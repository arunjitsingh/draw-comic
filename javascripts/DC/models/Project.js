(function(DC) {
  var kDefaults = {
    name: "New Project",
    type: 'project',
    pages: []
  };
  
  DC.Project = function(attr) {
    var self = this;
    _.extend(self, kDefaults, attr || {});
  };
})(window.DC);