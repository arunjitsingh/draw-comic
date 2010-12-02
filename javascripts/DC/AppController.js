(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  DC.APP = $({});
  
  DC.APP.project = null;
  DC.APP.selectedPage = null;
  DC.APP.selectedLayer = null;
  
  
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
  
  DC.APP.changeSelectedLayer = function(to) {
    if (DC.APP.selectedLayer != to) {
      $('.layer.selected').removeClass('selected');
      DC.APP.selectedLayer = to;
      to.addClass("selected");
    
      //DC.$.trigger("layer-changed");
    }
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
  
  DC.APP.textify = function(view) {
    view.draggable({
      stop: function() {
        var node = $(this);
        var data = node.data();
        data.x = node.position().left;
        data.y = node.position().top;
        node.data(data);
      }
    });
    view.editable({
      finishedEditing: function() {
        var node = $(this);
        var data = node.data();
        data.text = node.html();
        node.data(data); 
      }
    });
  };
  
  // Event Handlers
  DC.APP.bind({
    "new": function(evt, pname, pid) {
      DC.APP.project = DC.Project.create();
      if (!_.isEmpty(pname)) {
        DC.APP.project.name = pname;
      }
      DC.APP.trigger("check-pid", [pid]);
      DC.$.trigger("new-project");
    },
    
    "check-pid": function(evt, pid) {
      if (!_.isEmpty(pid)) {
        $.ajax({
          url: DC.db.uri + pid,
          type: "HEAD",
          dataType: 'json',
          success: function(d) {
            // project found, pid not unique
            pid = prompt("ID in use. Try another one");
            DC.APP.trigger("check-pid", [pid]);
          },
          error: function(xhr, err) {
            DC.APP.project._id = pid;
            DC.$.trigger('change-pid-hash');
          }
        });
      }
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
                        ["Couldn't load the project", "Project doesn't exist", []]);
            }
          },
          error: function(status, error, reason) {
            DC.$.trigger("error", 
                      ["Couldn't load the project", reason, [status, error]]);
          }
        });
      }
    },
    
    "save": function(evt) {
      DC.APP.processForSaving();
      //console.log("will save");
      if (navigator.onLine) {
        DC.db.saveDoc(DC.APP.project, {
          success: function(data) {
            if (data.ok) {
              DC.APP.project._id = data.id;
              DC.APP.project._rev = data.rev;
              DC.$.trigger("change-pid-hash");
              DC.$.trigger("project-saved");
            }
          },
          error: function(status, error, reason) {
            DC.$.trigger("error", 
                      ["Couldn't save the project", reason, [status, error]]);
          }
        });
      } else {
        alert("You are not online. Offline storage is not yet implemented");
        DC.offlineStore.saveDoc(DC.APP.project);
      }
    },
    
    "addImage": function(evt, fileName) {
      var data = {
        bitmap: DC.db.uri + DC.APP.project._id + "/" + fileName,
        x: 0, y: 0, z: 0
      };
      DC.APP.trigger("addLayer", [data]);
    },
    
    "addPage": function(evt, data) {
      var page = DC.Page.create(data || {});
      var pv = DC.PageView.create(page);
      DC.viewRoot.append(pv);
      DC.APP.selectedPage = pv;
      //DC.APP.project.pages.push(page);
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
    "updateLayer": function(evt, layer) {
      
    },
    "deleteLayer": function(evt, layer, page) {},
    
    "addText": function(evt, data) {
      var text = DC.Text.create(data || {});
      var tv = DC.TextView.create(text);
      DC.APP.selectedPage.append(tv);
    },
    "updateText": function(evt, object, page) {},
    "deleteText": function(evt, object, page) {},
    
    
    
    "render": function(evt) {
      var p = DC.APP.project;
      _.each(p.pages, function(p) {
        DC.APP.trigger("addPage", [p]);
        _.each(p.layers, function(l) {
          DC.APP.trigger("addLayer", [l]);
        });
        
        _.each(p.texts, function(t) {
          DC.APP.trigger("addText", [t]);
        });
      });
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

      var texts = $(".dc-text", page);
      texts.each(function(ti, text) {
        text = $(text);
        var t = text.data();
        //console.log(t);
        data.pages[idx].texts.push(DC.Text.convert(t));
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