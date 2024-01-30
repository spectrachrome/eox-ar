<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
    <a-marker preset="custom" type="pattern" url="./assets/marker/marker.patt">
      <a-box position="0 1 0" material="opacity: 0.5; color: #F70087;"></a-box>
    </a-marker>
    <a-entity camera></a-entity>
  </a-scene>
</template>

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
