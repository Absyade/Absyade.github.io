// Text rotate on banner
var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid white }";
  document.body.appendChild(css);
};


// Mapbox

        mapboxgl.accessToken = "pk.eyJ1IjoiYWJzaW5obyIsImEiOiJjanlrNnc5cnEwMDBxM2xqd3pzaGc3eXdlIn0.R1EDUPGVZqRPRhrWUUFmXw";
        var map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/absinho/ck3z0ogoj19971cn7cbxqod2t",
          center: [-0.125, 51.508],
          zoom: 2,
        });
        map.addControl(new mapboxgl.NavigationControl());
        var size = 100;
// implementation of CustomLayerInterface to draw a pulsing dot icon on the map
// see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

// get rendering context for the map canvas when layer is added to the map
onAdd: function() {
  var canvas = document.createElement('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  this.context = canvas.getContext('2d');
},
// called once before every frame where the icon will be used
render: function() {
  var duration = 1000;
  var t = (performance.now() % duration) / duration;

  var radius = size / 2 * 0.3;
  var outerRadius = size / 2 * 0.7 * t + radius;
  var context = this.context;
// draw outer circle
context.clearRect(0, 0, this.width, this.height);
context.beginPath();
context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
context.fill();

// draw inner circle
context.beginPath();
context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
context.fillStyle = 'rgba(255, 100, 100, 1)';
context.strokeStyle = 'white';
context.lineWidth = 2 + 4 * (1 - t);
context.fill();
context.stroke();

// update this image's data with data from the canvas
this.data = context.getImageData(0, 0, this.width, this.height).data;

// continuously repaint the map, resulting in the smooth animation of the dot
map.triggerRepaint();

// return `true` to let the map know that the image was updated
return true;
}
};

map.on('load', function () {

  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

  map.addLayer({
    "id": "points",
    "type": "symbol",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [-0.125, 51.508]
          }
        }]
      }
    },
    "layout": {
      "icon-image": "pulsing-dot"
    }
  });
});
map.scrollZoom.disable();




