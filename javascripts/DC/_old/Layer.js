var DC = DC || {};
DC.Layer = function(page) {
  if (!page) {
    throw new Error("Layer needs to know what page to attach to");
  }
  var self = this;
  
  var node = $('<canvas class="layer"></canvas>')
              .draggable({
                stop: function() {
                  self.x = $(this).position().left;
                  self.y = $(this).position().top;
                }
              })
              .css({position: 'absolute', top: 0, left: 0});
  
  _.extend(self, {
    base64: "",
    x: 0,
    y: 0
  });
  
  self.view = function() {
    return node;
  };
  
  self.page = function() {
    return page;
  };

  self.populate = function(data) {
    _.extend(self, data);
  };
};