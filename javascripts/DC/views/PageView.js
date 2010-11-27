var DC = DC || {};
DC.PageView = function(page) {
  if (!page) {
    throw new Error("Model for PageView missing!");
  }
  var self = this;
  
  /* private functions like `function fn(...) {...}` */
  /* public functions like `this.fn = function(...) {...};`
   *                    or `self.fn = function(...) {...};`
   */
  
  var node = $('<div class="page"><canvas class="page-base"></canvas></div>');
  
  _.extend(self, {
    layers: [],
    objects: []
  });
  
  self.view = function() {
    return node;
  };
  
  self.addLayer = function() {
    var layer = new DC.Layer(self);
    self.layers.push(layer);
    return layer;
  };
  
  self.removeLayer = function(layer) {
    var pos = self.layers.indexOf(layer);
    if (pos >= 0) {
      self.layers.slice(pos, 1);
      layer.view().remove();
    }
  };
  
  self.addObject = function() {
    var object = new DC.Object(self);
    self.objects.push(object);
    return object;
  };
  
  self.removeObject = function(object) {
    var pos = self.objects.indexOf(object);
    if (pos >= 0) {
      self.objects.slice(pos, 1);
      object.view().remove();
    }
  };

  self.populate = function(data) {
    _.extend(self, data);
    _.each(self.layers, function(layer) {
      
    });
    _.each(self.objects, function(object) {
      
    });
  };
};