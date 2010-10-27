var kObjectWidth = 250;     //px
var kObjectLineHeight = 50; //px
var kObjectMaxCharsPerLine = 50;
var kNewCanvasString = '<canvas width="%@1" height="%@2" class="c-object"></canvas>';
var kContextFont = '25px "Comic Sans MS"';

var kContainerOffsetX = $("#container").offset().left;
var kContainerOffsetY = $("#container").offset().top;

function addObject(text) {
  text = (text.toString()).truncate(150); //truncate to 150 chars
  var txtlen = text.toString().length;
  var w = kObjectWidth, 
    h = (txtlen / kObjectMaxCharsPerLine + 1) * kObjectLineHeight;
  var newCanvas = $(kNewCanvasString.fmt(w,h));
  var context = newCanvas[0].getContext('2d');
  
  context.strokeStyle = "#000000";
  context.lineWidth = 5.0;
  
  context.strokeRect(0, 0, w, h);
  
  context.font = kContextFont;
  context.lineWidth = 1.0;
  context.fillText(text, 25, 25);
  
  newCanvas.css({position:'absolute',top:0, left:0});
  newCanvas.draggable();
  
  $('#container').first().append(newCanvas);
}

function flattenCanvas() {
  var canvas = $("#canvas");
  var context = canvas[0].getContext('2d');
  
  $(".c-object").each(function() {
    var obj = $(this);
    context.drawImage(obj[0],
      obj.position().left - obj.offset().left,
      obj.position().top  - obj.offset().top
    );
    obj.hide();
    obj = null;
  });
}