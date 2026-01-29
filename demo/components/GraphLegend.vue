<script setup lang="ts">
</script>

<template>
  <div class="legend">
    <label>Legend</label>
    <div class="legend-grid">
      <div class="legend-item">
        <span class="dot start"></span>
        <span>Start</span>
      </div>
      <div class="legend-item">
        <span class="dot target"></span>
        <span>Target</span>
      </div>
      <div class="legend-item">
        <span class="dot current"></span>
        <span>Current</span>
      </div>
      <div class="legend-item">
        <span class="dot queued"></span>
        <span>In Queue</span>
      </div>
      <div class="legend-item">
        <span class="dot visited"></span>
        <span>Visited</span>
      </div>
      <div class="legend-item">
        <span class="dot path"></span>
        <span>Path</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legend {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

.legend label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.5rem;
}

.legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #111;
  background: #fff;
}

.dot.start {
  background: #111;
}

.dot.target {
  border-width: 3px;
}

.dot.current {
  background: #fff;
  border-color: #ff6b00;
  border-width: 3px;
}

.dot.queued {
  background: #cce5ff;
  border-color: #004085;
}

.dot.visited {
  background: #d4edda;
  border-color: #155724;
}

.dot.path {
  background: #111;
}
</style>
