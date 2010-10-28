var kObjectWidth = 200;     //px
var kObjectLineHeight = 50; //px
var kObjectMaxCharsPerLine = 50;
var kNewCanvasString = '<canvas width="%@1" height="%@2" class="c-object"></canvas>';
var kNewDivString = '<div width="250" height="250" class="d-object"></div>';
var kContextFont = '10pt "Comic Sans MS" center';
var kObjectCount = 0;

var kContainerOffsetLeft = $("#container").offset().left;
var kContainerOffsetTop  = $("#container").offset().top;

var kCanvasOffsetLeft = $("#canvas").offset().left;
var kCanvasOffsetTop  = $("#canvas").offset().top;

function addObject() {
  var text = prompt("New dialog");
  if (typeof(text)==='undefined' || text == '') {
    return;
  }
  text = (text.toString()).truncate(150); //truncate to 150 chars
  var txtlen = text.toString().length;
  var w = kObjectWidth, 
    h = (txtlen / kObjectMaxCharsPerLine + 1) * kObjectLineHeight;
  var newCanvas = $(kNewCanvasString.fmt(w,h));
  var context = newCanvas[0].getContext('2d');
  
  context.strokeStyle = "#000000";
  context.lineWidth = 2.0;
  context.fillStyle = "#FFFFFF";
  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(w,0);
  context.lineTo(w,h);
  context.lineTo(0,h);
  context.stroke();
  context.fill();
  context.closePath();
  
  context.font = kContextFont;
  context.lineWidth = 1.0;
  context.fillStyle = "#000000";
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
    console.log(obj[0], obj.position().left, obj.position().top);
    console.log(obj[0], obj.offset().left, obj.offset().top);
    context.drawImage(obj[0],
      obj.position().left,
      obj.position().top
    );
    obj.hide();
    obj = null;
  });
}