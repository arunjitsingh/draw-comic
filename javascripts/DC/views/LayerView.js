(function(DC) {
  var kDefaults = {
    bitmap: "",
    x: 0,
    y: 0,
    width: 500,
    height: 500
  };
  var kDefaultContext = {
    strokeStyle: "#000000",
    lineWidth: 1.0
  };
  DC.LayerView = function(attr) {
    if (!attr.layer) {
      //
    }
    if (!_.isEmpty(attr.data)) {
      _.extend(self.data, kDefaults, attr.data);
    }
    
    var self = this;
    _.extend(self.context, kDefaultContext, attr.context || {});
    var node = $('<canvas class="layer"></canvas>')
                .draggable({
                  stop: function() {
                    
                  }
                })
                .css({position: 'absolute', top: 0, left: 0});
    
    if (!_.isEmpty(attr.image)) {
      var img = attr.image;
      node.attr({width: img.width, height: img.height});
      var ctx = node.find('canvas')[0].getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      _.extend(self.data, {width: img.width, height: img.height});
    }
    
    self.view = function() {
      return node;
    };
    
    self.updateData = function() {
      self.data.x = $(this).position().left;
      self.data.y = $(this).position().top;
    };
  };
})(window.DC);