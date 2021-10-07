import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

const source = new VectorSource({wrapX: false});

const vector = new VectorLayer({
  source: source,
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vector
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

const createButton = document.getElementById('create');
const clearButton = document.getElementById('clear');
const markdirtyButton = document.getElementById('markdirty');
const minz = document.getElementById('minz');
const maxz = document.getElementById('maxz');

let draw; // global so we can remove it later
function addPolygon() {
  draw = new Draw({
    source: source,
    type: "Polygon",
  });
  draw.on('drawend', function () {
    map.removeInteraction(draw);
  });
  map.addInteraction(draw);
  createButton.disabled = true;
  clearButton.disabled = false;
  markdirtyButton.disabled = false;
}

function clearPolygon() {
  source.clear();
  if (draw) {
    draw.abortDrawing();
    map.removeInteraction(draw);
  }
  createButton.disabled = false;
  clearButton.disabled = true;
  markdirtyButton.disabled = true;
}

createButton.onclick = addPolygon;
clearButton.onclick = clearPolygon;
// Start with no polygon on load.
clearPolygon();

// Constrain zoom ranges to valid.
minz.onchange = function () {
  if (parseInt(minz.value) > parseInt(maxz.value)) {
    maxz.value = parseInt(minz.value);
  }
}
maxz.onchange = function () {
  if (parseInt(minz.value) > parseInt(maxz.value)) {
    minz.value = parseInt(maxz.value);
  }
}
