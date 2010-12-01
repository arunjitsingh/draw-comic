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
  
  var pageKeys = ["layers", "objects"];
  
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
    
    
    
  DC.ProjectView = {};
  DC.ProjectView.create = function(data, options) {
    

  };
  
  
  
  
  DC.ProjectController = $({
    addPage: function(options) {
      var page = DC.PageController.createPage(options);
      page.viewIndex(DC.current['project'].pageIndex());
      DC.APP.project.pages.push({});
    },
    
    removePage: function(page) {
      DC.APP.project.pages[page.viewIndex()] = null;
      page.view().remove();
    },
    
    selectedPage: function() {
      return 0;
    }
  });
    

})(window.DC);