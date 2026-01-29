<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const emit = defineEmits<{
  ready: [el: HTMLDivElement];
}>();

const containerEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (containerEl.value) {
    emit('ready', containerEl.value);
  }
});
</script>

<template>
  <div class="graph-canvas">
    <div ref="containerEl" class="cytoscape"></div>
  </div>
</template>

<style scoped>
.graph-canvas {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 3px;
  min-height: 400px;
}

.cytoscape {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
