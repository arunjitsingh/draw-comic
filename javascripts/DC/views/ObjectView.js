var DC = DC || {};
DC.Object = function(page) {
  if (!page) {
    throw new Error("Object needs to know what page to attach to");
  }
  var self = this;
  
  var node = $('<div class="object text"></div>')
              .draggable({
                stop: function() {
                  self.x = $(this).position().left;
                  self.y = $(this).position().top;
                }
              })
              .editable({
                finishedEditing: function() {
                  self.text = $(this).html();
                }
              })
              .css({position: 'absolute', top: 0, left: 0});
  _.extend(self, {
    text: "",
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