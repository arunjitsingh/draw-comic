var GLOBAL = {debug: false};
window.onload = function() {
  // Encapsulate application in here
  var doc = document;       // CREATING LOCAL COPY OF GLOBAL VARIABLE document
                            // (referencing is faster for local variables)
  var statusBar = doc.getElementById("status");   // self explanatory
  var canvas = doc.getElementById('canvas');    // self explanatory
  var context = canvas.getContext("2d");          // GET THE 2D DRAWING CONTEXT

  var isDrawing = false;    // NOT YET DRAWING
  context.scale(1, 1);      // 1:1 SCALING (OPTIONAL)
  context.strokeStyle = "#000000";  // BLACK COLORED LINES

  // EXTRACT x, y COORDS FROM AN event OBJECT 
  var getContextPoint = function(evt) {
    return {x: evt.offsetX || (evt.layerX - evt.target.offsetLeft),
            y: evt.offsetY || (evt.layerY - evt.target.offsetTop)};
  };

  // HANDLE MOUSE-DOWN EVENT
  var mouseDown = function(evt) {
    evt.preventDefault();
    if (GLOBAL.debug) {
      console.log(evt);
      console.log("MouseDown");
    }
    isDrawing = true;     // WHEN MOUSE IS DOWN, DRAWING HAS BEGUN
    context.beginPath();  // TELL context TO BEGIN DRAWING A PATH
    var p = getContextPoint(evt),
      x = p.x,
      y = p.y;
    context.moveTo(x, y); // MOVE THE "PENCIL" TO (x, y)
    statusBar.innerHTML = x + "," + y;
  };

  // HANDLE MOUSE-MOVE EVENT
  var mouseMove = function(evt) {
    evt.preventDefault();
    if (GLOBAL.debug) {
      console.log(evt);
      console.log("MouseMove");
    }
    var p = getContextPoint(evt),
      x = p.x,
      y = p.y;
    if (isDrawing) {    // CONTINUE ONLY IF DRAWING
      context.lineTo(x, y);   // DRAW A LINE FROM THE LAST POINT TO (x, y)
      statusBar.innerHTML = x + ":" + y;
      context.stroke();       // TELL THE context TO ACTUALLY RENDER THE LINE
    } else {
      statusBar.innerHTML = x + "," + y;
    }
  };

  // HANDLE MOUSE-UP EVENT
  var mouseUp = function(evt) {
    evt.preventDefault();
    if (GLOBAL.debug) {
      console.log(evt);
      console.log("MouseUp");
    }
    isDrawing = false;        // FINISHED DRAWING -- NO CLEAN-UP REQUIRED YET
    var p = getContextPoint(evt),
      x = p.x,
      y = p.y;
    statusBar.innerHTML = x + "," + y;
  };

  // ATTACH EVENT HANDLERS TO THE canvas
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousemove', mouseMove, false);
  console.log('application ready');
};


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