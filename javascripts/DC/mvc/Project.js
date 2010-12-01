(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    author: "",
    name: "New Project",
    type: 'project',
    pages: []
  };
  
  var pageKeys = ["layers", "texts"];
  
  DC.Project = {};
  DC.Project.create = function(attr) {
    var project = {};
    _.extend(project, kDefaults, attr || {});
    
    if (project.pages) {
      _.cleanArray(project.pages);
    }
    _.each(pageKeys, function(k) {
      _.cleanArray(project.pages[k]);
    });
    
    
    return project;
  };
  

})(window.DC);