/**
 * EXPORTING THE CANVAS (Chrome supports only "image/png")
 */
function exportPDF() {
  var canvas = document.getElementById("canvas");
  var w = canvas.getAttribute('width'),
    h = canvas.getAttribute('height');
  // CREATES A BASE64 ENCODED VERSION OF THE CANVAS.. DOES NOT REQUIRE IMAGES TO BE UPLOADED
  var data = canvas.toDataURL('application/pdf'); // Chrome currently defaults to "image/png"
  window.open(data, "Export", "width="+w+",height="+h); // PUT THE ENCODED CANVAS INTO A NEW WINDOW
  // THIS (LAST) STEP WORKS AS IF YOU OPENED A TEXT/IMAGE DOCUMENT IN THE BROWSER.. HOWEVER, 
  // THE DATA IS ACTUALLY _IN_ THE URL, WHICH ALL (MAJOR) BROWSERS CAN RENDER.
}

/**
 * SAVING TO LOCAL STORAGE
 */
function saveLocally() {
  if ("localStorage" in window) {
    var store = window.localStorage,    // THE HTML5 OFFLINE PERSISTENT STORE
      canvas = document.getElementById("canvas");
    var data = canvas.toDataURL('image/png');
    store["canvas"] = data;             // THE STORE IS A SIMPLE HASH (OBJECT)
  }
}


/**
 * LOADING FROM LOCAL STORAGE
 */
function loadLast() {
  if ("localStorage" in window) {
    var store = window.localStorage,    // THE HTML5 OFFLINE PERSISTENT STORE
      doc = document,
      canvas = doc.getElementById("canvas"),
      loadbox = doc.getElementById("load-box");
    var data = store["canvas"];
    if (data && (/^data/ig).test(data)) {
      console.log("Data available");
      var img = doc.createElement("img");
      img.src = data;
      loadbox.appendChild(img);
      var ctx = canvas.getContext("2d");
      var w = ~~(canvas.getAttribute('width')),
        h = ~~(canvas.getAttribute('height'));
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
    }
  }
}

/**
 * CLEARING THE CANVAS
 */
function clearCanvas() {
    var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d");
    var w = ~~(canvas.getAttribute('width')),
      h = ~~(canvas.getAttribute('height'));
    context.clearRect(0, 0, w, h);
}

var kObjectWidth = 200;     //px
var kObjectLineHeight = 50; //px
var kObjectMaxCharsPerLine = 50;
var kNewCanvasString = '<canvas width="%@1" height="%@2" class="c-object"></canvas>';
var kContextFont = '10pt "Comic Sans MS" center';
var kObjectCount = 0;

var kContainerOffsetLeft = $(".canvas-container").first().offset().left;
var kContainerOffsetTop  = $(".canvas-container").first().offset().top;

var kCanvasOffsetLeft = $("#canvas").offset().left;
var kCanvasOffsetTop  = $("#canvas").offset().top;

function addText() {
  $("<div class='text object'></div>")
    .editable()
    .draggable()
    .appendTo("body");
}

// function renderText(text) {
//   text = (text.toString()).truncate(150); //truncate to 150 chars
//   var txtlen = text.toString().length;
//   var w = kObjectWidth, 
//     h = (txtlen / kObjectMaxCharsPerLine + 1) * kObjectLineHeight;
//   var newCanvas = $(kNewCanvasString.fmt(w,h));
//   var context = newCanvas[0].getContext('2d');
//   
//   context.strokeStyle = "#000000";
//   context.lineWidth = 2.0;
//   context.fillStyle = "#FFFFFF";
//   context.beginPath();
//   context.moveTo(0,0);
//   context.lineTo(w,0);
//   context.lineTo(w,h);
//   context.lineTo(0,h);
//   context.stroke();
//   context.fill();
//   context.closePath();
//   
//   context.textAlign = "center";
//   context.font = kContextFont;
//   context.lineWidth = 1.0;
//   context.fillStyle = "#000000";
//   context.fillText(text, 25, 25);
//   
//   newCanvas.css({position:'absolute',top:0, left:0});
//   newCanvas.draggable();
//   
//   $(".canvas-container").first().append(newCanvas);
// }

// function flattenText() {
//   var canvas = $("#canvas");
//   var context = canvas[0].getContext('2d');
//   
//   $(".c-object").each(function() {
//     var obj = $(this);
//     // console.log(obj[0], obj.position().left, obj.position().top);
//     // console.log(obj[0], obj.offset().left, obj.offset().top);
//     context.drawImage(obj[0],
//       obj.position().left,
//       obj.position().top
//     );
//     obj.remove();
//     obj = null;
//   });
// }

function flattenText() {
  var canvas = $("#canvas");
  var context = canvas[0].getContext('2d');
  
  $('.object.text').each(function() {
    var obj = $(this);
    context.drawImage(obj[0],
      obj.position().left,
      obj.position().top
    );
    obj.remove();
    obj = null;
  });
}