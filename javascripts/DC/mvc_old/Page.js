(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    layers: [],
    objects: []
  };
  
  DC.Page = {};
  DC.Page.create = function(data) {
    var page = _.extend({}, kDefaults, data);
    return page;
  };
  
  
  DC.PageView = {};
  DC.PageView.create = function(attr) {
    var controller = attr.controller;
    var node = $("#load-box .page-container").first().clone();
    node.data(attr.data);
    node.bind({
      "update": function(evt) {
        controller.trigger("update", node);
      }
    });
    return node;
  };
  
  
  
  DC.PageController = {};
  DC.PageController.create = function() {
    var pages = [];
    var views = [];
    var controller = $({});
    
    controller.pages = function() {
      return pages;
    };
    
    controller.addPage = function(data) {
      pages.push(DC.Page.create(data));
      views.push(DC.PageView.create({data:data, controller:controller}));
    };
    controller.removePage = function(page) {
      
    };
    
    controller.layerController = DC.LayerController.create();
    controller.objectController = DC.ObjectController.create();
    
    controller.bind({
      "update": function(evt, view) {
        
      },
      "delete": function(evt, view) {
        
      }
    });
    
    return controller;
  };
  
})(window.DC);