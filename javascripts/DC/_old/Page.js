var DC = DC || {};
DC.Page = function() {
  var self = this;
  _.extend(self, {
    layers: [],
    objects: []
  });

  self.populate = function(data) {
    _.extend(self, data);
    _.each(self.layers, function(layer) {
      //do something for each layer in page
    });
    _.each(self.objects, function(object) {
      //do something for each object in page
    });
  };
  
  self.add = function(where, what) {
    var key;
    if ((/(objects?)|(layers?)/gi).test(where)) {
      key = where + (where.substr(-1)==='s') ? '' : 's';
    } else {
      throw new Error('Property "' + where + '" does not exist');
    }
    if (_.isArray(what)) {
      self[key].concat(what);
    } else {
      self[key].push(what);
    }
  };
  
  self.remove = function(where, what) {
    var key;
    if ((/(objects?)|(layers?)/gi).test(where)) {
      key = where + (where.substr(-1)==='s') ? '' : 's';
    } else {
      throw new Error('Property "' + where + '" does not exist');
    }
    if (_.isArray(what)) {
      return;
    }
    var pos = self[key].indexOf(what);
    if (pos >= 0) {
      self[key].splice(pos, 1);
    }
  };
};