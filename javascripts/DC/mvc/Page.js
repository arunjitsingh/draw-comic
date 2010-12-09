(function(DC) {
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
  
  
})(window.DC);