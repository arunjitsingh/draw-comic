$(document).ready(function() {
  var statusBar = $("#status");
  var canvas = $('#canvas');
  var context = canvas[0].getContext("2d");

  var isDrawing = false;
  context.scale(1, 1);
  context.strokeStyle = "#000000";

  var mouseDown = function(evt) {
    evt.preventDefault();
    isDrawing = true;
    context.beginPath();
    var p = $(canvas).mouse(evt),
      x = p.x,
      y = p.y;
    context.moveTo(x, y);
    statusBar.innerHTML = x + "," + y;
  };
  
  var mouseMove = function(evt) {
    evt.preventDefault();
    var p = $(canvas).mouse(evt),
      x = p.x,
      y = p.y;
    if (isDrawing) {
      context.lineTo(x, y);
      context.stroke();
    }
    statusBar.innerHTML = x + "," + y;
  };
  
  var mouseUp = function(evt) {
    evt.preventDefault();
    isDrawing = false;
    var p = $(canvas).mouse(evt),
      x = p.x,
      y = p.y;
    statusBar.innerHTML = x + "," + y;
  };
  
  canvas.bind({
    'mousedown': mouseDown,
    'mouseup': mouseUp,
    'mousemove': mouseMove
  });
  console.log('application ready');
});