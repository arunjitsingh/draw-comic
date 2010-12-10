(function() {
    
  var doc = $(document);
  var body = $(document.body);
  
  doc
    .ajaxSend(function() {
      DC.$.trigger("loading-start");
    })
    .ajaxComplete(function() {
      DC.$.trigger("loading-end");
    })
    .ajaxError(function() {
      DC.$.trigger("loading-end");
    });
  
  var URLRegex = DC.URLREGEX;
  
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
        if (!_.isEmpty(pid)) {
          $.ajax({
            url: DC.db.uri + pid,
            type: "HEAD",
            dataType: 'json',
            success: function(d) {
              // project found, pid not unique
              callback({"id": "ID in use. Try another one"});
            },
            error: function(xhr, err) {
              DC.APP.trigger("new", [pname, pid]);
              callback();
            }
          });
        } else {
          callback();
          DC.APP.trigger("new", [pname, pid]);
        }
        
        $("#application").empty();
        //callback();
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
  
  
  $("#export-project").click(function() {
    DC.APP.trigger("export");
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
      DC.$.trigger("error", ["Can't upload", "Image types JPEG, BMP, PNG only"]);
      return false;
    }
    DC.$.trigger("loading-start");
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
          DC.$.trigger("loading-end");
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
  
  $("#image-url").click(function() {
    if (!(DC.APP.project && DC.APP.selectedPage)) {
      DC.$.trigger("error", ["Can't Open URL", "Create a project & page first."]);
      return false;
    }
    $.showDialog('dialogs/url.html', {
      submit: function(data, callback) {
        var url = data.url;
        if (!URLRegex.test(url)) {
          callback({url: "Invalid URL"});
          return;
        }
        
        DC.APP.trigger("addImage", [url, true]);
        callback();
      }
    });
  });
  
  $("#google").click(function() {
    
    if (!navigator.onLine) {
      DC.$.trigger("error", ["Google Images Unavailable", "You are not connected to the internet"]);
      return;
    }
    if (!(DC.APP.project && DC.APP.selectedPage)) {
      DC.$.trigger("error", ["Can't Search", "Create a project & page first."]);
      return false;
    }
    $.showDialog('dialogs/google.html', {
      
      submit: function(data, callback) {
        console.log("will search", data);
        
        var keyw = data.keyword;
        var elt = $("#dialog #search-results");
        
        if (keyw) {
          GOOG.trigger("image-search", [keyw, elt, function(args) {
            if (args) {
              callback(args);
              return;
            }
            elt.find("img").dblclick(function() {
              var url = this.src;
              DC.APP.trigger("addImage", [url, true]);
              callback();
            });
          }]);
        } else {
          callback({"keyword": "Required field"});
        }
      }
    });
    
  });
  
  
  $("#dc-h").click(function() {
    $("#login-toolbar .toolbar").toggleClass("hidden");
  });
  
  function doLogin(username, password, callback) {
    if (!username || !password) {
      return;
    }
    DC.$.trigger("loading-start");
    $.couch.login({
      name: username,
      password: password,
      success: function(response) {
        DC.$.trigger("logged-in", username);
        if (_.isFunction(callback)) {
          callback();
        }
        DC.$.trigger("loading-end");
      },
      error: function(status, error, reason) {
        DC.$.trigger("error", ["Error logging in", reason, [status, error]]);
        if (_.isFunction(callback)) {
          callback();
        }
        DC.$.trigger("loading-end");
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
  
  
  $("#login-form #signup").click(function(evt) {
    evt.preventDefault();
    $.showDialog('dialogs/signup.html', {
      load: function(elt) {
        
      },
      submit: function(data, callback) {
        var name = data.username;
        var pass = data.password;
        DC.$.trigger("loading-start");
        if (!name || !(/^[^_]\w+$/gi).test(name)) {
          callback({"username": "Invalid username"});
          return;
        }
        if (!pass || !(/^.+$/gi).test(pass)) {
          callback({"password": "Invalid password"});
          return;
        }
        //console.log(name, pass);
        $.couch.signup({name : name}, pass, {
          success : function() {
            doLogin(name, pass);            
            DC.$.trigger("info", ["Success!", "Signup was successful.<br>The app should sign you in automatically"]);
            DC.$.trigger("loading-end");
          },
          error : function(status, error, reason) {
            if (error == "conflict") {
              callback({"username": "Username '"+name+"' is taken"});
            } else {
              callback({"username": "Signup error:  "+reason});
            }
            DC.$.trigger("loading-end");
          }
        });
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
      DC.$.trigger("change-pid-hash");
      DC.$.trigger("info",
        ["Saved!", "ID: "+DC.APP.project._id+"<br>You can now use the page URL to share"]);
    },
    
    "change-pid-hash": function(evt) {
      var id = DC.APP.project._id;
      if (id) window.location.hash = id;
      else window.location.hash = null;
    },
    
    "loading-start": function(evt) {
      body.addClass('isloading');
    },
    "loading-end": function(evt) {
      body.removeClass('isloading');
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
            DC.USER = {};
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
        },
        cancel: function() {
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
        },
        cancel: function() {
        }
      });
      console.error("Error:", error, ":", reason, "(", info, ")");
    }
  });
  
  DC.$.trigger("update-userCtx");
  if (window.loadComplete) {
    window.loadComplete();
  }
  
  // EXTREMELY DANGEROUS. YOU SHOULD NEVER DO THIS
  window.alert = function(what) {
    console.info("::alert::", what);
  };
  
})();