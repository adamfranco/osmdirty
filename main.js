import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import {OSM, TileDebug, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {createXYZ} from 'ol/tilegrid';

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
    new TileLayer({
      source: new TileDebug(),
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

const status = document.getElementById('status');
const status_current = document.getElementById('status-current');
const status_total = document.getElementById('status-total');

let draw; // global so we can remove it later
function addPolygon() {
  draw = new Draw({
    source: source,
    type: "Polygon",
  });
  draw.on('drawend', function () {
    map.removeInteraction(draw);
    markdirtyButton.disabled = false;
  });
  map.addInteraction(draw);
  createButton.disabled = true;
  clearButton.disabled = false;
  markdirtyButton.disabled = true;
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

function getTilesForFeature(feature, minz, maxz) {
  var tiles = [];
  var grid = createXYZ();
  // Build a list of all possible tiles that might intersect the full bbox of
  // the feature.
  var geometry = feature.getGeometry();
  for (var z = minz; z <= maxz; z = z + 1) {
    grid.forEachTileCoord(geometry.getExtent(), z, function (tile_coord) {
      tiles.push(tile_coord);
    });
  }
  console.log('before filtering', tiles);
  // Filter out tiles that don't actually intersect the feature.
  return tiles.filter(function (tile_coord) {
    return geometry.intersectsExtent(grid.getTileCoordExtent(tile_coord))
  });
}

markdirtyButton.onclick = function() {
  for (var feature of source.getFeatures()) {
    var tiles = getTilesForFeature(feature, parseInt(minz.value), parseInt(maxz.value));
    console.log('after filtering', tiles);
    if (tiles.length > 1000) {
      alert("You're trying to mark " + tiles.length + " tiles as dirty. Reduce the zoom range or area to keep it under 1,000.");
    }
    else if (confirm("This will mark " + tiles.length + " tiles as dirty. Are you sure that you want to fire off this many requests?")) {
      markTilesDirty(tiles);
    }
  }
}

function markTilesDirty(tiles) {
  status.style.visibility = 'visible';
  status_total.innerHTML = tiles.length;
  markNextTileDirty(tiles, 0);
}

function markNextTileDirty(tiles, i) {
  if (i >= tiles.length) {
    status.style.visibility = 'hidden';
  } else {
    status_current.innerHTML = i + 1;
    var tile = tiles[i];
    var baseUrl = 'https://a.tile.openstreetmap.org/' + tile[0] + '/' + tile[1] + '/' + tile[2] + '.png';
    var dirtyUrl = baseUrl + '/dirty';
    console.log(dirtyUrl);
    setTimeout(markNextTileDirty, 500, tiles, i + 1);
  }
}
