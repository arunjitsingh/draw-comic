// MY MIXINS

_.mixin({
  state: function(object) {
    return JSON.parse(JSON.stringify(object));
  },
  
  cleanArray: function(object) {
    if (_.isArray(object)) {
      var len = object.length,
          i = 0;
      while (i < len) {
        var o = _(object[i]);
        if (o.isEmpty() || o.isUndefined() || o.isNaN() || o.isNull()) {
          object.splice(i, 1);
          i--;
          len--;
        }
        i++;
      }
    }
  },
  
  areEqual: function(o1, o2, allowempty) {
    allowempty = allowempty ? true : false;    
    return (allowempty && (o1 === o2)) || (!_.isEmpty(o1) && !_.isEmpty(o2) && (o1 === o2));
  }
});