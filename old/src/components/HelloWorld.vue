<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <img src="../assets/marker/marker.png" height="50%" width="50%" alt="Marker" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
