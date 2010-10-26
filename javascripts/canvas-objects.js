var kObjectWidth = 250;     //px
var kObjectLineHeight = 50; //px
var kObjectMaxCharsPerLine = 50;
var kNewCanvasString = '<canvas width="%@1" height="%@2" top="0" left="0"></canvas>';
var kContextFont = '25px "Comic Sans MS"';

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
  context.fillText(text, 20, 20);
  
  $('#container').first().append(newCanvas);
}