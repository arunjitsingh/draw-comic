/*
Draw-Comic: An online drawing and sharing application.
Copyright (C) 2010  Arunjit Singh

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

AppController.js: Application Controller for the application
*/

(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  DC.APP = $({});
  
  DC.APP.project = null;
  DC.APP.selectedPage = null;
  DC.APP.selectedLayer = null;
  
  DC.USER.cachedProjectsList = null;
  DC.APP.prepareProjectsList = function(elt) {
    elt = $(elt);
    var div = elt.find("#projects-list");
    var cache = DC.USER.cachedProjectsList;
    if (DC.USER.name && cache) {
      //console.log("load:::cache", cache.data());
      div.empty().append(cache);
      DC.APP.findUserProjects(div);
    } else if (DC.USER.name) {
      div.empty(); //indicate that projects are being looked for
      DC.APP.findUserProjects(div);
    }
  };
  DC.APP.findUserProjects = function(elt) {
    DC.db.view('app/user-projects', {
      reduce:false,
      key:DC.USER.name,
      success:function(response) {
        var cache = DC.USER.cachedProjectsList;
        var projects = response.rows;
        if (!projects.length) {
          elt.empty().append('<div style="color:#AAA;text-align:center">No projects</div>');
          return;
        }
        var ul = {};
        if (cache && projects === cache.data().list) {
          ul = cache;
          //console.log("using cache", projects, cache.data().list);
        } else {
          //console.log("reloading cache");
          ul = $("<ul></ul>");
          var li = $("<li>");
          _.each(projects, function(project) {
            var e = li.clone();
            e.data(project);
            e.html("<span class='name'>"+project.value+"</span>");
            e.click(function() {
              var d = $(this).data();
              elt.parent().find(".project-id, [name=id]").val(d.id);
            });
            ul.append(e);
          });

          DC.USER.cachedProjectsList = ul;
          DC.USER.cachedProjectsList.data({list:projects});
          elt.empty().append(ul);
          elt.parents("#dialog").centerBox();
        }
        
      }
    });
  };
  
  
  DC.APP.newPageIndex = function() {
    return DC.APP.project.pages.length || 0;
  };
  
  DC.APP.selectedPageIndex = function() {
    return DC.APP.selectedPage._index;
  };
  
  DC.APP.newLayerIndex = function() {
    var pos = DC.APP.selectedPageIndex();
    return DC.APP.project.pages[pos].layers.length;
  };
  
  DC.APP.selectedLayerIndex = function() {
    return DC.APP.selectedLayer._index;
  };
  
  DC.APP.changeSelectedPage = function(to) {
    var page = DC.APP.selectedPage;
    if (!page || !(page[0]._uid === to[0]._uid)) {
      $('.page-container.selected').removeClass('selected');
      DC.APP.selectedPage = to;
      to.addClass("selected");
      
      //DC.$.trigger("page-changed");
    }
  };
  
  DC.APP.changeSelectedLayer = function(to) {
    var layer = DC.APP.selectedLayer;
    if (!layer || !(layer[0]._uid === to[0]._uid)) {
      $('.layer.selected').removeClass('selected');
      DC.APP.selectedLayer = to;
      to.addClass("selected");
      //DC.$.trigger("layer-changed");
    }
  };
  
  DC.APP.pagify = function(view) {
    view.bind('click.DCPageSelect', function() {
      DC.APP.changeSelectedPage($(this));
    });
    //view.drawable();
  };
  
  DC.APP.layerify = function(view) {
    view.draggable({
      stop: function() {
        var node = $(this);
        var data = node.data();
        data.x = node.position().left;
        data.y = node.position().top;
        node.data(data);
        
        DC.APP.changeSelectedLayer($(this));
        
      }
    });
    view.bind('click.DCLayerSelect', function() {
      DC.APP.changeSelectedLayer($(this));
    });
    //view.drawable();
  };
  
  
  var isSaving = false;
  /////////////////////////////////////////////////////////
  // EVENT HANDLERS
  DC.APP.bind({
    "new": function(evt, pname, pid) {
      DC.APP.project = DC.Project.create();
      DC.APP.project.name = pname || "untitled";
      if (!_.isEmpty(pid)) {
        DC.APP.project._id = pid;
      }
      DC.APP.selectedPage = DC.APP.selectedLayer = null;
      DC.$.trigger("new-project");
    },
    
    "open": function(evt, id) {
      id = id.toString();
      if ((/\w+/gi).test(id)) {
        //check if project exists.
        DC.db.openDoc(id, {}, {
          success: function(data) {
            if (data._id === id) {
              //valid project
              DC.APP.project = DC.Project.create(data);
              //DC.APP.processForSaving();
              DC.$.trigger("change-pid-hash");
              DC.APP.trigger("render");
              DC.$.trigger("new-project");

            } else {
              DC.$.trigger("error", 
                        ["Couldn't load the project", "Project doesn't exist"]);
            }
          },
          error: function(status, error, reason) {
            DC.$.trigger("error", 
                      ["Couldn't load the project", "Project doesn't exist", [reason, status, error]]);
          }
        });
      } else {
        DC.$.trigger("error", 
                  ["Couldn't load the project", "Invalid ID"]);
      }
    },
    
    "save": function(evt) {
      if (!DC.APP.project) {
        DC.$.trigger("error",
                ["Can't save the project", "Create a new project"]);
        return;
      }
      if (!(DC.USER && DC.USER.name)) {
        DC.$.trigger("error",
          ["Couldn't save the project", "You are not logged in"]);
        return;
      }
      if (!DC.USER || !(DC.USER.name === DC.APP.project.author)) {
        DC.$.trigger("error",
          ["Couldn't save the project", "You are not the author of this document"]);
        return;
      }
      if (isSaving) {
        DC.$.trigger("error", ["Can't Save the Project", "There is an active save operation"]);
        return;
      }
      DC.APP.processForSaving();
      if (navigator.onLine || !DC.offlineStore.use) {
        // this is either online or offline on localhost
        isSaving = true;
        DC.db.saveDoc(DC.APP.project, {
          success: function(data) {
            if (data.ok) {
              DC.APP.project._id = data.id;
              DC.APP.project._rev = data.rev;
              DC.$.trigger("change-pid-hash");
              DC.$.trigger("project-saved");
            }
            isSaving = false;
          },
          error: function(status, error, reason) {
            DC.$.trigger("error", 
                      ["Couldn't save the project", reason, [status, error]]);
            isSaving = false;
          }
        });
      } else if(DC.offlineStore.use) {
        DC.$.trigger("error", ["You are not online","Offline storage is not yet fully implemented"]);
        DC.offlineStore.saveDoc(DC.APP.project);
      } else {
        DC.$.trigger("error", ["You are not online","Offline storage is not yet fully implemented"]);
      }
    },
    
    
    "addImage": function(evt, uri, absolute) {
      if (!absolute) {
        uri = DC.db.uri + DC.APP.project._id + "/" + uri;
      }
      var data = {
        bitmap: uri,
        x: 0, y: 0, z: 0
      };
      DC.APP.trigger("addLayer", [data]);
    },
    
    "addPage": function(evt, data) {
      var page = DC.Page.create(data || {});
      var pv = DC.PageView.create(page);
      DC.viewRoot.append(pv);
      DC.APP.changeSelectedPage(pv);
      //DC.APP.project.pages.push(page);
      
      DC.APP.pagify(pv);
    },
    //delete layer
    "addLayer": function(evt, data) {
      var layer = DC.Layer.create(data || {});
      var lv = DC.LayerView.create(layer);
      DC.APP.selectedPage.append(lv);
      DC.APP.changeSelectedLayer(lv);
      //DC.APP.project.pages[DC.APP.selectedPageIndex()].layers.push(layer);
      
      DC.APP.layerify(lv);
    },
    
    
    "render": function(evt) {
      var p = DC.APP.project;
      _.each(p.pages, function(p) {
        DC.APP.trigger("addPage", [p]);
        _.each(p.layers, function(l) {
          DC.APP.trigger("addLayer", [l]);
        });
      });
    },
    
    
    "export": function(evt) {
      var page = $("#application .page-container").first();
      var canvas = $("canvas.page", page).clone();
      var context = canvas[0].getContext('2d');
      $.each($(".layer", page), function(idx, layer) {
        layer = $(layer);
        var x = layer.position().left;
        var y = layer.position().top;
        layer = layer[0];
        context.drawImage(layer, x, y);
      });
      try {
        var data = canvas[0].toDataURL();
        window.open(data, 
          (DC.APP.project || {name:"untitled"})['name'] + ".png", 
          "width=%@, height=%@".fmt(page.width(), page.height()));
      } catch(e) {
        DC.$.trigger("error", ["Can't Export", "Cross domain policy prohibits converting external images", [e]]);
      }
      
    }
    
    
  });
  
  
  DC.APP.processForSaving = function() {
    var data = {pages:[]};
    DC.APP.project.pages = [];
    var pages = $("#application .page-container");
    //console.log(pages);
    pages.each(function(idx, page) {
      page = $(page);
      var p = page.data();
      data.pages[idx] = {layers: [], texts: []};
      
      var layers = $(".layer", page);
      layers.each(function(li, layer) {
        layer = $(layer);
        var l = layer.data();
        //console.log(l);
        data.pages[idx].layers.push(DC.Layer.convert(l));
      });
      
    });
    
    DC.APP.project.pages = data.pages;
    
    
  };
  
  DC.APP.reviseProject = function() {
    DC.db.openDoc(DC.APP.project._id, {
      success: function(data) {
        //var pages = DC.APP.project.pages;
        _.extend(DC.APP.project, data);
        //DC.APP.project.pages = pages;
        // if (DC.APP.project._attachments) {
        //   var att = DC.APP.project._attachments;
        //   var rev = DC.APP.project._rev;
        //   for (var f in att) {
        //     _.extend(att[f], {stub: true, revpos: parseInt(rev, 10)});
        //   }
        // }
      }
    });
  };
  
  
})(window.DC);