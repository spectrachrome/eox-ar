<script setup>
import HelloWorld from './components/HelloWorld.vue'
/*
// Gen random data
const N = 300;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
}));

const globeEntity = document.getElementById('globe');
globeEntity.setAttribute('globe', {
  pointsData: gData,
  pointAltitude: 'size',
  pointColor: 'color'
});
*/

const tiff = await fromUrl(options.geotiff.url);
const image = await tiff.getImage();
// get currently zoomed to location index
const location = this.locations[this.selectedLocationIndex];
const { bbox } = location;
// Convert geographic coordinates to distances using EPSG:3857
const xmin = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[0], bbox[1]]);
const xmax = proj4(options.geotiff.projection, 'EPSG:3857', [bbox[2], bbox[3]]);

const xDistance = xmax[0] - xmin[0];
const yDistance = xmax[1] - xmin[1];

// compute the width of a single hex (gameSize), divided by 2 but multiply by ~1.155 to
// account for the below mentioned hexagon wider than taller
this.gameSize = Math.round(xDistance / this.size / 1.75);

// Adjust board dimensions based on actual distances
this.width = this.size;
this.height = Math.round(
  (yDistance / xDistance)
  * this.size
  // Account for the fact that hexagons are wider than tall
  * 1.18,
);
// Read the GeoTIFF data into a 1-dimensional array
const [oX, oY] = image.getOrigin();
const [imageResX, imageResY] = image.getResolution(image);

let wnd = [
  Math.round((bbox[0] - oX) / imageResX),
  Math.round((bbox[1] - oY) / imageResY),
  Math.round((bbox[2] - oX) / imageResX),
  Math.round((bbox[3] - oY) / imageResY),
];
wnd = [
  Math.min(wnd[0], wnd[2]),
  Math.min(wnd[1], wnd[3]),
  Math.max(wnd[0], wnd[2]),
  Math.max(wnd[1], wnd[3]),
];

let data = (await image.readRasters({
  window: wnd,
  width: this.width,
  height: this.height,
}))[0];

// Flip the GeoTIFF upside down
data = data.reverse();

const flippedData = new Array(data.length);
// Flip rows in our 1-dimensional array as if it were 2D
for (let y = 0; y < this.height; y++) {
  for (let x = 0; x < this.width; x++) {
    const newData = data[y * this.width + (this.width - 1 - x)];
    flippedData[y * this.width + x] = newData;
  }
}

data = flippedData;
const centerInLonLat = [bbox[0], bbox[1]];
const center = proj4(options.geotiff.projection, 'EPSG:3857', centerInLonLat);
// not actually center but left bottom corner of start of board but subtract ~1.5 hex
this.center = [center[0] - 1.0 * this.gameSize, center[1] + 0.5 * this.gameSize];

// Assuming the data is a single band and the size matches the game board
for (let y = 0; y < this.height; y++) {
  const row = [];
  for (let x = 0; x < this.width; x++) {
    const value = data[y * this.width + x];
    let isMine;
    if (location.isMineCondition) {
      isMine = !Number.isNaN(value) && location.isMineCondition(value);
    } else {
      isMine = Math.round(Math.random());
    }
    row.push({
      isMine,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
      element: null,
    });
  }

  this.board.push(row);
}

this.fieldCount = this.width * this.height;
</script>

<template>
  <a-scene
      vr-mode-ui="enabled: false;"
      stats
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
    >
      <a-entity camera></a-entity>

      <a-marker type="pattern" url="./patterns/hiro.patt">
        <a-entity id="globe" scale="0.006 0.006 0.006" globe="
        globe-image-url: //unpkg.com/three-globe/example/img/earth-dark.jpg;
        bump-image-url: //unpkg.com/three-globe/example/img/earth-topology.png;
      "></a-entity>
      </a-marker>
    </a-scene>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  onMounted() {
    
  },
})
</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
