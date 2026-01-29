<script setup lang="ts">
import type { Algorithm } from '../types';
import { GRAPHS, ALGORITHMS } from '../data/graphs';

const props = defineProps<{
  selectedGraph: string;
  startNode: string;
  targetNode: string;
  algorithm: Algorithm;
  speed: number;
  isAnimating: boolean;
  nodes: string[];
}>();

const emit = defineEmits<{
  'update:selectedGraph': [value: string];
  'update:startNode': [value: string];
  'update:targetNode': [value: string];
  'update:algorithm': [value: Algorithm];
  'update:speed': [value: number];
  run: [];
  step: [];
  stop: [];
  reset: [];
}>();
</script>

<template>
  <aside class="control-panel">
    <div class="control-group">
      <label>Graph</label>
      <select 
        :value="selectedGraph" 
        @change="emit('update:selectedGraph', ($event.target as HTMLSelectElement).value)"
        :disabled="isAnimating"
      >
        <option v-for="g in GRAPHS" :key="g.key" :value="g.key">
          {{ g.label }}
        </option>
      </select>
    </div>

    <div class="control-row">
      <div class="control-group">
        <label>Start</label>
        <select 
          :value="startNode" 
          @change="emit('update:startNode', ($event.target as HTMLSelectElement).value)"
          :disabled="isAnimating"
        >
          <option v-for="n in nodes" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div class="control-group">
        <label>Target</label>
        <select 
          :value="targetNode" 
          @change="emit('update:targetNode', ($event.target as HTMLSelectElement).value)"
          :disabled="isAnimating"
        >
          <option v-for="n in nodes" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div class="control-group">
      <label>Algorithm</label>
      <select 
        :value="algorithm" 
        @change="emit('update:algorithm', ($event.target as HTMLSelectElement).value as Algorithm)"
        :disabled="isAnimating"
      >
        <option v-for="a in ALGORITHMS" :key="a.value" :value="a.value">
          {{ a.label }}
        </option>
      </select>
    </div>

    <div class="control-group">
      <label>Speed: {{ speed }}ms</label>
      <input
        type="range"
        :value="speed"
        @input="emit('update:speed', Number(($event.target as HTMLInputElement).value))"
        min="100"
        max="1000"
        step="100"
        :disabled="isAnimating"
      />
    </div>

    <div class="buttons">
      <button @click="emit('run')" :disabled="isAnimating" class="primary">
        Run
      </button>
      <button @click="emit('step')" :disabled="isAnimating">
        Step
      </button>
      <button @click="emit('stop')" :disabled="!isAnimating">
        Stop
      </button>
      <button @click="emit('reset')" :disabled="isAnimating">
        Reset
      </button>
    </div>

    <slot name="result"></slot>
    <slot name="debugger"></slot>
    <slot name="legend"></slot>
  </aside>
</template>

<style scoped>
.control-panel {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-row {
  display: flex;
  gap: 0.5rem;
}

.control-row .control-group {
  flex: 1;
}

.control-group label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.control-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.8rem;
  background: #fff;
}

.control-group select:focus {
  outline: none;
  border-color: #111;
}

.control-group input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
}

.buttons button {
  padding: 0.5rem 0.25rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.7rem;
  cursor: pointer;
  background: #fff;
  transition: all 0.1s;
}

.buttons button.primary {
  background: #111;
  color: #fff;
  border-color: #111;
}

.buttons button:hover:not(:disabled) {
  border-color: #111;
}

.buttons button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
