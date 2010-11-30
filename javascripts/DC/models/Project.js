(function(DC) {
  var kDefaults = {
    author: "",
    name: "New Project",
    type: 'project',
    pages: []
  };
  
  DC.Project = function(attr) {
    var self = this;
    _.extend(self, kDefaults, attr || {});
    
    self.updateAuthor = function(userCtx) {
      if (userCtx && userCtx.name) {
        self.author = userCtx.name;
      }
    };
  };
})(window.DC);