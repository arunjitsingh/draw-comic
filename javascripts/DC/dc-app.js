(function(/*jQuery*/$, /*underscore*/_){
  
  var json = JSON.stringify;
  var parseJS = JSON.parse;
  
  /*Namespace object DC*/
  window.DC = {};
  
  DC.$ = $({});  // uh-oh! need to use jQ's eventing system
  
  DC.USER = {};
  
  DC.viewRoot = $("#application");
  
  DC.db = $.couch.db('draw-comic');
  
  DC.offlineStore = {
    name: "draw-comic",
    handle: "dc",
    use: false,
    saveDoc: function(doc) {
      if ('localStorage' in window) {
        window.localStorage.setItem(DC.offlineStore.name, json(doc));
        window.localStorage.setItem(DC.offlineStore.handle, json(true));
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
  
  
  DC.__uid = 0;
  DC.uid = function() {
    return "dc" + Math.floor(DC.__uid += Math.random()*1000);
  };

  //current state
  DC.current = {
    'project': {},
    'page': null,
    'layer': null
  };
  
})(window.jQuery, window._);
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
        var ul = {};$("<ul></ul>");
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
                        ["Couldn't load the project", "Project doesn't exist"]);
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
      if (!DC.APP.project) {
        DC.$.trigger("error",
                ["Can't save the project", "Create a new project"]);
        return;
      }
      DC.APP.processForSaving();
      //console.log("will save");
      if (navigator.onLine || !DC.offlineStore.use) {
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
      } else if(DC.offlineStore.use) {
        DC.$.trigger("error", ["You are not online","Offline storage is not yet fully implemented"]);
        DC.offlineStore.saveDoc(DC.APP.project);
      } else {
        DC.$.trigger("error", ["You are not online","Offline storage is not yet fully implemented"]);
      }
    },
    
    "addImage": function(evt, fileName) {
      var uri = DC.db.uri + DC.APP.project._id + "/" + fileName;
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
(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    bitmap: "",
    x: 0,
    y: 0,
    z: 0,
    width: 300,
    height: 300
  };
  var kDefaultContext = {
    strokeStyle: "#000000",
    lineWidth: 1.0
  };
  
  DC.Layer = {};
  DC.Layer.create = function(data) {
    var layer = {};
    _.extend(layer, kDefaults, data || {});
    return layer;
  };
  DC.Layer.convert = function(layer) {
    return {
      bitmap: layer.bitmap,
      x: layer.x,
      y: layer.y,
      z: layer.z,
      width: layer.width,
      height: layer.height
    };
  };
  
  
  DC.LayerView = {};
  DC.LayerView.create = function(layer) {
    
    var node = $("#load-box .layer").first().clone();
    node.attr({width: layer.width,height: layer.height});
    node.css({position: 'absolute', top: layer.y, left: layer.x});
    
    //node._index = DC.APP.newLayerIndex();

    if (layer.bitmap) {
      var img = new Image();
      img.src = layer.bitmap;
      img.onload = function() {
        var cvs = node.is("canvas") ? node[0] : node.find("canvas").first()[0];
        var ctx = cvs.getContext('2d');
        cvs.setAttribute("width", img.width);
        cvs.setAttribute("height", img.height);
        _.extend(layer, {width: img.width, height:img.height});
        var ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);
        layer.bitmap = cvs.toDataURL();
        //console.log(layer.bitmap);
        var data = node.data();
        _.extend(data, layer);
        node.data(data);
      };
    }
    node[0]._uid = DC.uid();
    node.data(layer);
    return node;
  };
  
})(window.DC);(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    layers: [],
    texts: []
  };
  
  DC.Page = {};
  DC.Page.create = function(data) {
    var page = {};
    _.extend(page, kDefaults, data || {});
    return page;
  };
  DC.Page.convert = function(page) {
    return {
      layers: page.layers,
      texts: page.texts
    };
  };
  
  DC.PageView = {};
  DC.PageView.create = function(page) {
    var node = $("#load-box .page-container").first().clone();
    node.css({position: 'absolute', top: 0, left: 0});
    node.data(page);
    //node._index = DC.APP.newPageIndex();
    node[0]._uid = DC.uid();
    return node;
  };
  
  
})(window.DC);(function(DC) {
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
  

})(window.DC);(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    text: "",
    x: 0,
    y: 0,
    z: 0,
    width: 200,
    height: 50
  };
  
  DC.Text = {};
  DC.Text.create = function(data) {
    var text = {};
    _.extend(text, kDefaults, data || {});
    return text;
  };
  
  DC.Text.convert = function(text) {
    return {
      text: text.text,
      x: text.x,
      y: text.y,
      z: text.z,
      width: text.width,
      height: text.height
    };
  };
  
  DC.TextView = {};
  DC.TextView.create = function(text) {
    var node = $("#load-box .text-line").first().clone();
    node.attr({width: text.width, height: text.height});
    node.css({position: 'absolute', top: text.y, left: text.x});
    node.data(text);
    return node;
  };
  
})(window.DC);