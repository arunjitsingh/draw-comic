(function(/*jQuery*/$, /*underscore*/_){
  /*Namespace object DC*/
  window.DC = {};
  
  DC.$ = $({});  // uh-oh! need to use jQ's eventing system
  
  var kBaseURI = "/draw-comic/";
  
  DC.AppController = {}; //Application Controller
  DC.APP = DC.AppController; //shortcut for DC.AppController


  //load project
  //create new project
  
  DC.currentProject = {};
  
  DC.loadProject = function(id) {
    id = id.toString();
    if (!_.isEmpty(id)) {
      //check if project exists.
      $.getJSON(kBaseURI+id, function(data) {
        if (data._id === id) {
          //valid project
          DC.currentProject = new DC.Project(data);
        } else {
          //project does not exist.
        }
      });
    }
  };
  
  DC.createNewProject = function() {
    DC.currentProject = new DC.Project();
  };
  
  DC.saveCurrentProject = function() {
    var id = DC.currentProject._id;
    var json = JSON.stringify(DC.currentProject);
    console.log(json);
    $.ajax({
      url: kBaseURI + (id || ""),
      type: (id ? "PUT" : "POST"),
      contentType: "application/json",
      dataType: 'json',
      data: json,
      success: function(data) {
        if (data.ok) {
          DC.currentProject._id = data.id;
          DC.currentProject._rev = data.rev;
        }
      },
      error: function(xhr, status, error) {}
    });
  };
  
  
  DC.$.newLayerNode = function() {
    return $('<div class="layer-container"><canvas class="layer"></div>').clone();
  };
  
})(window.jQuery, window._);