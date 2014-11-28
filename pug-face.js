var ccv = require('./ccv');
var cascade = require('./cascade');

window.onload = function() {
  var img = document.createElement("img");
  img.setAttribute("width", "100px");
  img.setAttribute("height", "100px");
  img.setAttribute("src", "/faces.jpg");
  img.setAttribute("id", "pug-face");

  var comp = ccv.detect_objects({ 
    canvas : ccv.grayscale(ccv.pre(img)),
    cascade: cascade,
    interval: 4,
    min_neighbors: 1
  });

  console.log(comp);
};
