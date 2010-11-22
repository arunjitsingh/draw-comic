_.mixin({
  state: function(object) {
    return JSON.parse(JSON.stringify(object));
  }
});