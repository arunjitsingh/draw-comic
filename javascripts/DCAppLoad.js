$(document).ready(function() {
  
  $(".toolbar-container .toggle").click(function() {
    $(this).siblings(".toolbar").toggleClass("hidden");
  });
  
  $("#new-project").click(function() {
    var pname = prompt("Name your project:");
    var pid = prompt("A unique project ID:");
    DC.APP.trigger("new", [pname, pid]);
    // add a new page automatically
  });
  
  $("#open-project").click(function() {
    var pid = prompt("Project ID:"); //ch. prompt to non-blocking dialog
    if(pid && _.isString(pid)) {
      DC.APP.trigger("open", [pid]);
    }
  });
  
  $("#save-project").click(function() {
    DC.APP.trigger("save");
  });
  
  
  $("#new-page").click(function() {
    DC.APP.trigger("addPage");
  });
  $("#add-layer").click(function() {
    DC.APP.trigger("addLayer");
  });
  $("#edit-layer").click(function() {
    if (DC.APP.selectedLayer) {
      DC.APP.selectedLayer.drawable({enable:true});
      //$('.button'). //DISABLE ALL OTHER BUTTONS
      $("#done-edit-layer").show();
      $("#edit-layer").hide();
    }
    //DC.APP.selectedLayer.trigger("edit");
  });
  $("#done-edit-layer").click(function() {
    if (DC.APP.selectedLayer) {
      DC.APP.selectedLayer.drawable({disable:true});
      DC.$.trigger("layer-changed");
    }
  });
  $("#delete-layer").click(function() {
    if (DC.APP.selectedLayer) {
      DC.APP.selectedLayer.remove();
    }
    //DC.APP.selectedLayer.trigger("delete");
  });
  $("#add-text").click(function() {
    DC.APP.trigger("addText");
  });
  
  
  var form = $("#upload-form");
  form.submit(function(evt) {
    evt.preventDefault();
    var id = DC.APP.project._id,
      rev = DC.APP.project._rev;
    if (!id || !rev) {
      alert("Save the project before uploading images");
      return false;
    }
    form.find("input[name=_rev]").val(rev);
    var fileName = form.find("input[name=_attachments]").val();
    if (_.isEmpty(fileName) || (/no file selected/i).test(fileName)) {
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
          //alert(fileName + " saved!");
          // load image into page
          if (response.rev) {
            DC.APP.project._rev = response.rev;
            DC.APP.reviseProject();
          }
          form.find("input[name=_attachments]").val("");
          DC.APP.trigger("addImage", [fileName]);
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
      $("#layer-toolbar .toolbar").removeClass("hidden");
      $("#project-toolbar .toolbar").addClass("hidden");
      DC.$.trigger("update-userCtx");
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
      $(".toolbar-container .toolbar").addClass("hidden");
      $("#login-toolbar .toolbar").removeClass("hidden");
      DC.$.trigger("update-userCtx");
    },
    
    "layer-changed": function(evt) {
      $("#edit-layer").show();
      $("#done-edit-layer").hide();
    },
    
    
    "change-pid-hash": function(evt) {
      var id = DC.APP.project._id;
      window.location.hash = id;
    },
    
    "update-userCtx": function() {
      $.couch.session({
        success: function(response) {
          if (response.userCtx) {
            DC.USER = response.userCtx;
            if (!_.isEmpty(DC.APP.project)) {
              DC.APP.project.author = DC.USER.name;
            }
          }
        },
        error: function(status, error, reason) {
          DC.USER = {};
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
  
  
  
  if (window.location.hash) {
    var pid = window.location.hash;
    pid = pid.substring(1);
    DC.APP.trigger("open", [pid]);
  }
  
  // TEST TO CHECK IF localStorage NEEDS TO BE USED
  
});