<script setup>
  import HelloWorld from './components/HelloWorld.vue';

  AFRAME.registerComponent('updater', {
    init: function() {
      // declare variable for later access
      this.num = 0;
      // you can also access the underlying 3D object of a scene object,
      //   for example:
      // let target = document.querySelector('#earth').object3D;
      // target.scale.set( 0.75, 0.75, 0.75 );
    },

    // time      = total time since init (milliseconds)
    // timeDelta = time since last tick
    tick: function(time, timeDelta) {
      this.num += 1;
      // console.log( this.num );
    }
  });

  // access underlying 3D object this component is attached to
  AFRAME.registerComponent('spinner', {
    init: function() {
        this.el.object3D.scale.set(0.75, 0.75, 0.75);
    },

    tick: function(time, timeDelta) {
        this.el.object3D.rotation.y += 0.01;
    },
  });
    
  AFRAME.registerComponent('draw-canvas', {
    schema: {default: ''},

    init: function () {
      this.canvas = document.getElementById(this.data);
      this.ctx = this.canvas.getContext('2d');

      // Draw on canvas...
    }
  });
</script>

<template>
  <a-scene embedded vr-mode-ui="enabled: false;" arjs="debugUIEnabled: false;">
    <a-assets>
      <img id="earth-sphere" src="./images/earth-sphere.jpg" />
      <canvas id="map-canvas" crossorigin="anonymous"></canvas>
    </a-assets>
    <a-marker type="pattern" url="./patterns/hiro.patt">
      <a-sphere 
        id="earth"
        position="0 0.5 0" 
        material="src: #earth-sphere; transparent: true; opacity: 1.0;"
        spinner >
      </a-sphere>
    </a-marker>
    <a-entity camera></a-entity>
    <!-- empty entity, running previously declared script -->
    <a-entity updater></a-entity>
  </a-scene>
</template>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden
}
</style>
