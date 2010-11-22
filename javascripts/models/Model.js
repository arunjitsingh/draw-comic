var DC = DC || {};
DC.Model = function() {
  var self = this;
  
  /* private functions like `function fn(...) {...}` */
  /* public functions like `this.fn = function(...) {...};`
                        or `self.fn = function(...) {...};`
   */
   
  var properties = {};   // private

  self.set = function() {
   var args = Array.prototype.slice.call(arguments);
   if (_.isString(args[0])) {
     properties[args[0]] = args[1];
   } else if (typeof(args[0]) === 'object' && !_.isArray(args[0])) {
     _.extend(properties, args[0]);
   }
  };

  self.get = function(key) {
   return properties[key];
  };
};