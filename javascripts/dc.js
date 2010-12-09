(function() {
  
  $("#dc-h").dblclick(function() {
    var toolbars =  $(".toolbar-container .toolbar");
    if (toolbars.hasClass("hidden")) {
      toolbars.removeClass("hidden");
    } else {
      toolbars.addClass("hidden");
    }
  });
  
  $(".toolbar-container .toggle").click(function() {
    $(this).siblings(".toolbar").toggleClass("hidden");
  });
  
  $("#new-project").click(function() {
    // show new dialog
    
    $.showDialog("dialogs/new.html", {
      submit: function(data, callback) {
        var pname = data.name || "untitled";
        var pid = data.id;
        DC.APP.trigger("new", [pname, pid]);
        $("#application").empty();
        callback();
      },
      cancel: function() {}
    });
    
    // add a new page automatically
  });
  
  $("#open-project").click(function() {
    // show open dialog
    $.showDialog("dialogs/open.html", {
      load: function(elt) {
        DC.APP.prepareProjectsList(elt);
      },
      
      submit: function(data, callback) {
        var id = data.id;
        if (!id) {
          callback({id: "Enter a project ID"});
          return;
        }
        DC.APP.trigger("open", [id]);
        $("#application").empty();
        callback();
      }
    });
    
    
  });
  
  $("#save-project").click(function() {
    DC.$.trigger("update-userCtx");
    DC.APP.trigger("save");
  });
  
  
  $("#new-page").click(function() {
    if ($("#application .page-container").length >= 1) {
      DC.$.trigger("error", ["Experimental soft limit", "Limited to 1 page in experimental versions"]);
      return;
    }
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
      DC.$.trigger("error", ["Can't Upload", "Save the project before uploading images"]);
      return false;
    }
    form.find("input[name=_rev]").val(rev);
    var fileName = form.find("input[name=_attachments]").val();
    
    if (_.isEmpty(fileName) || (/no file selected/i).test(fileName)) {
      DC.$.trigger("error", ["Can't Upload", "Please select a file"]);
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
          if ((/fakepath/).test(fileName)) {
            fileName = fileName.substring(fileName.lastIndexOf("\\")+1);
          }
          DC.$.trigger("info", ["Uploaded!", '"' +fileName+'" was uploaded']);
          if (response.rev) {
            DC.APP.project._rev = response.rev;
            DC.APP.reviseProject();
          }
          form.find("input[name=_attachments]").val("");
          DC.APP.trigger("addImage", [fileName]);
        }
      },
      error: function(xhr, error, status) {
        DC.$.trigger("error", ["Error", "File '"+fileName+"' could not be uploaded"]);
        console.error(xhr, error, status);
      },
      clearForm: true
    });
    return false;
  });
  
  
  $("#dc-h").click(function() {
    $("#login-toolbar .toolbar").toggleClass("hidden");
  });
  
  function doLogin(username, password, callback) {
    if (!username || !password) {
      return;
    }
    $.couch.login({
      name: username,
      password: password,
      success: function(response) {
        DC.$.trigger("logged-in", username);
        if (_.isFunction(callback)) {
          callback();
        }
      },
      error: function(status, error, reason) {
        DC.$.trigger("error", ["Error logging in", reason, [status, error]]);
        if (_.isFunction(callback)) {
          callback();
        }
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
  
  function doSignup(name, password, callback, runLogin) {
    $.couch.signup({name : name}, password, {
      success : function() {
        if (runLogin) {
          doLogin(name, password, callback);            
        } else {
          callback();
        }
      },
      error : function(status, error, reason) {
        if (error == "conflict") {
          callback({name : "Name '"+name+"' is taken"});
        } else {
          callback({name : "Signup error:  "+reason});
        }
      }
    });
  }
  
  $("#login-form #signup").click(function(evt) {
    evt.preventDefault();
    $.showDialog('dialogs/signup.html', {
      load: function(elt) {
        
      },
      submit: function(data, callback) {
        var name = data.username;
        var pass = data.password;
        
        if (!name || !(/^[^_]\w+$/gi).test(name)) {
          callback({"username": "Invalid username"});
        }
        if (!pass || !(/^.+$/gi).test(pass)) {
          callback({"password": "Invalid password"});
        }
        
        doSignup(name, pass, callback, true);
      }
    });
  });
  
  
  //EVENT BINDINGS ON DC.$:
  DC.$.bind({
    "new-project": function(evt) {
      $("#page-toolbar .toolbar").removeClass("hidden");
      $("#layer-toolbar .toolbar").removeClass("hidden");
      //$("#project-toolbar .toolbar").addClass("hidden");
      DC.$.trigger("update-userCtx");
    },
    "new-page": function(evt) {
      $("#layer-toolbar .toolbar").removeClass("hidden");
    },
    "new-layer": function(evt) {
      $("#layer-toolbar .toolbar").removeClass("hidden");
    },
    "logged-in": function(evt, username, update) {
      $("#login-form").hide().find("#username, #password").val("");
      $("#logout-form").show().find("#user").text(username);
      $("#login-toolbar .toolbar").addClass("loggedin");
      $("#project-toolbar .toolbar").removeClass("hidden");
      if (!update) DC.$.trigger("update-userCtx");
      
    },
    "logged-out": function(evt, update) {
      $("#logout-form").hide().find("#user").text("");
      $("#login-toolbar .toolbar").removeClass("loggedin");
      $("#login-form").show();
      $(".toolbar-container .toolbar").addClass("hidden");
      $("#login-toolbar .toolbar").removeClass("hidden");
      $("#projects-list").empty().text("Log in to see your projects");
      if (!update) DC.$.trigger("update-userCtx");
    },
    
    "layer-changed": function(evt) {
      $("#edit-layer").show();
      $("#done-edit-layer").hide();
    },
    
    "project-saved": function(evt) {
      DC.$.trigger("info",
        ["Saved!", "ID: "+DC.APP.project._id+"<br>You can now use the page URL to share"]);
    },
    
    "change-pid-hash": function(evt) {
      var id = DC.APP.project._id;
      window.location.hash = id;
    },
    
    "update-userCtx": function() {
      $.couch.session({
        success: function(response) {
          var user = response.userCtx;
          if (user.name) {
            DC.USER = response.userCtx;
            if (!_.isEmpty(DC.APP.project)) {
              DC.APP.project.author = DC.USER.name;
            }
            var list = $("#dialog #projects-list");
            if (list.length) {
              DC.APP.prepareProjectsList(list.parents("#dialog"));
            }
            DC.$.trigger("logged-in", [DC.USER.name, true]);
          } else {
            // user is not logged in
            DC.$.trigger("logged-out", [true]);
          }
        },
        error: function(status, error, reason) {
          DC.USER = {};
          DC.$.trigger("logged-out", [true]);
        }
      });
    },
    
    "info": function(evt, title, info) {
      var title = title || "F.Y.I";
      var info = info || "That last thing worked";
      $.showDialog('dialogs/info.html', {
        load: function(elt) {
          elt = $(elt);
          elt.find("h4").text(title);
          elt.find("div.info").html(info);
          $("#dialog").centerBox();
        }
      });
    },
    
    "error": function(evt, error, reason, info) {
      var error = error || "Error";
      var reason = reason || "Uh oh.. I don't know why!";
      $.showDialog('dialogs/error.html', {
        load: function(elt) {
          elt = $(elt);
          elt.find("h4").text(error);
          elt.find("div.error").html(reason);
          $("#dialog").centerBox();
        }
      });
      console.error("Error:", error, ":", reason, "(", info, ")");
    }
  });
  
  DC.$.trigger("update-userCtx");
  if (window.loadComplete) {
    window.loadComplete();
  }
  
  // TEST TO CHECK IF localStorage NEEDS TO BE USED
  
})();
(function() {
  if (window.location.hash) {
    var pid = window.location.hash;
    pid = pid.substring(1);
    DC.APP.trigger("open", [pid]);
  }
})();
(function() {
  var appCache = window.applicationCache;
  if (appCache) {
    function handleCacheEvent(e) {
      switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
          break;
        case appCache.IDLE: // IDLE == 1
          break;
        case appCache.CHECKING: // CHECKING == 2
          break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
          break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 5
          appCache.swapCache();
          break;
        case appCache.OBSOLETE: // OBSOLETE == 5
          break;
        default:
          break;
      };
    }

    function handleCacheError(e) {
      console.error('Error: Cache failed to update!');
    };

    // Fired after the first cache of the manifest.
    appCache.addEventListener('cached', handleCacheEvent, false);

    // Checking for an update. Always the first event fired in the sequence.
    appCache.addEventListener('checking', handleCacheEvent, false);

    // An update was found. The browser is fetching resources.
    appCache.addEventListener('downloading', handleCacheEvent, false);

    // The manifest returns 404 or 410, the download failed,
    // or the manifest changed while the download was in progress.
    appCache.addEventListener('error', handleCacheError, false);

    // Fired after the first download of the manifest.
    appCache.addEventListener('noupdate', handleCacheEvent, false);

    // Fired if the manifest file returns a 404 or 410.
    // This results in the application cache being deleted.
    appCache.addEventListener('obsolete', handleCacheEvent, false);

    // Fired for each resource listed in the manifest as it is being fetched.
    appCache.addEventListener('progress', handleCacheEvent, false);

    // Fired when the manifest resources have been newly redownloaded.
    appCache.addEventListener('updateready', handleCacheEvent, false);
  }
})();