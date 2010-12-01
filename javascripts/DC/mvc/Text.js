(function(DC) {
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