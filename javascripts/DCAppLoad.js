(function(/*jQuery*/$, /*underscore*/_){
  
  var json = JSON.stringify;
  
  /*Namespace object DC*/
  window.DC = {};
  
  DC.$ = $({});  // uh-oh! need to use jQ's eventing system
  
  DC.userCtx = {};
  
  DC.db = $.couch.db('draw-comic');
  DC.offlineStore = {
    name: "draw-comic",
    used: false,
    saveDoc: function(doc) {
      if ('localStorage' in window) {
        window.localStorage.setItem(DC.offlineStore.name, json(doc));
        DC.offlineStore.used = true;
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
  
  DC.AppController = {}; //Application Controller
  DC.APP = DC.AppController; //shortcut for DC.AppController


  //load project
  //create new project
  
  DC.currentProject = {};
  
  DC.loadProject = function(id) {
    id = id.toString();
    if (!_.isEmpty(id)) {
      //check if project exists.
      DC.db.openDoc(id, {}, {
        success: function(data) {
          if (data._id === id) {
            //valid project
            DC.currentProject = new DC.Project(data);
            DC.$.trigger("new-project");
          } else {
            DC.$.trigger("error", 
                      ["Couldn't load the project", "Project doesn't exist", []]);
          }
        },
        error: function(status, error, reason) {
          DC.$.trigger("error", 
                    ["Couldn't load the project", reason, [status, error]]);
        }
      });
    }
  };
  
  DC.createNewProject = function() {
    DC.currentProject = new DC.Project();
    DC.$.trigger("new-project");
  };
  
  DC.saveCurrentProject = function() {
    if (navigator.onLine) {
      DC.db.saveDoc(DC.currentProject, {
        success: function(data) {
          console.log(data);
          if (data.ok) {
            DC.currentProject._id = data.id;
            DC.currentProject._rev = data.rev;

          }
        },
        error: function(status, error, reason) {
          DC.$.trigger("error", 
                    ["Couldn't save the project", reason, [status, error]]);
        }
      });
    } else {
      DC.offlineStore.saveDoc(DC.currentProject);
    }
    
    
  };
  
  
  DC.$.newLayerNode = function() {
    return $('#load-box .layer').first().clone();
  };
  
})(window.jQuery, window._);

/*
 * Application load.. attach event handlers
 *
 */

$(document).ready(function() {
  $(".toolbar-container .toggle").click(function() {
    $(this).siblings(".toolbar").toggleClass("hidden");
  });
  
  $("#new-project").click(function() {
    DC.createNewProject();
    // add a new page automatically
  });
  
  $("#load-project").click(function() {
    var pid = prompt("Project ID:"); //ch. prompt to non-blocking dialog
    if(pid && _.isString(pid)) {
      DC.loadProject(pid);
    }
  });
  
  $("#save-project").click(function() {
    DC.saveCurrentProject();
  });
  
  
  
  var form = $("#upload-form");
  form.submit(function(evt) {
    evt.preventDefault();
    var id = DC.currentProject._id,
      rev = DC.currentProject._rev;
    if (!id || !rev) {
      alert("Save the project before uploading images");
      return false;
    }
    form.find("input[name=_rev]").val(rev);
    var fileName = form.find("input[name=_attachments]").val();
    if (!fileName || (/no file selected/i).test(fileName)) {
      alert("Please select a file");
      return false;
    }
    var ext = fileName.substring(fileName.lastIndexOf(".")+1);
    if (!(/(jpe?g)|(bmp)|(png)/gi).test(ext)) {
      alert("Image types JPEG, BMP, PNG only");
      return false;
    }
    form.ajaxSubmit({
      url: DC.db.uri + id,
      type: "PUT",
      success: function(response) {
        //response from couchdb is a <pre> block
        response = JSON.parse($(response).text());
        if (response.ok) {
          alert(fileName + " saved!");
          // load image into page
          // DC.loadImage(fileName)
        }
      },
      clearForm: true
    });
    return false;
  });
  
  
  $("#dc-h").click(function() {
    $("#login-toolbar .toolbar").toggleClass("hidden");
  });
  
  function doLogin(username, password) {
    if (!username || !password) {
      return;
    }
    $.couch.login({
      name: username,
      password: password,
      success: function(response) {
        DC.$.trigger("logged-in", username);
      },
      error: function(status, error, reason) {
        DC.$.trigger("error", ["Error logging in", reason, [status, error]]);
      }
    });
  }
  
  $("#login-form").submit(function(evt) {
    evt.preventDefault();
    doLogin($("#username").val(), $("#password").val());
    return false;
  });
  
  $("#logout-form").submit(function(evt) {
    evt.preventDefault();
    $.couch.logout({
      success: function(response) {
        DC.$.trigger("logged-out");
      },
      error: function(status, error, reason) {
        DC.$.trigger("error", ["Error logging out", reason, [status, error]]);
      }
    });
    return false;
  });
  
  
  
  //EVENT BINDINGS ON DC.$:
  DC.$.bind({
    "new-project": function(evt) {
      $("#page-toolbar .toolbar").removeClass("hidden");
      $("#project-toolbar .toolbar").addClass("hidden");
      DC.$.trigger("update-userCtx");
      //add/trigger new-page
    },
    "new-page": function(evt) {
      //do something
    },
    "new-layer": function(evt) {
      $("#layer-toolbar .toolbar").removeClass("hidden");
    },
    "logged-in": function(evt, username) {
      $("#login-form").hide().find("#username, #password").val("");
      $("#logout-form").show().find("#user").text(username);
      $("#login-toolbar .toolbar").addClass("loggedin");
      $("#project-toolbar .toolbar").removeClass("hidden");
      DC.$.trigger("update-userCtx");
    },
    "logged-out": function(evt) {
      $("#logout-form").hide().find("#user").text("");
      $("#login-toolbar .toolbar").removeClass("loggedin");
      $("#login-form").show();
      DC.$.trigger("update-userCtx");
    },
    
    
    "update-userCtx": function() {
      $.couch.session({
        success: function(response) {
          if (response.userCtx) {
            DC.userCtx = response.userCtx;
            if (!_.isEmpty(DC.currentProject)) {
              DC.currentProject.updateAuthor(DC.userCtx);
            }
          }
        },
        error: function(status, error, reason) {
          DC.userCtx = {};
        }
      });
    },
    
    "error": function(evt, error, reason, info) {
      var err = error || "Error";
      if (reason && _.isString(reason)) {
        err += ": " + reason;
      }
      alert(err);
      console.log("Error", error, reason, info);
    }
  });
  
  
  
  // TEST TO CHECK IF localStorage NEEDS TO BE USED
  
});