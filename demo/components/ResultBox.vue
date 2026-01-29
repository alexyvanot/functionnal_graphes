<script setup lang="ts">
import type { Result } from '../types';

defineProps<{
  result: Result;
}>();
</script>

<template>
  <div class="result-box">
    <label>Result</label>
    <div v-if="result.type === 'reachable'" class="result-value">
      {{ result.value ? 'Reachable' : 'Not reachable' }}
    </div>
    <div v-else class="result-value">
      <span class="algo-tag">{{ result.algo }}</span>
      <span v-if="result.value">{{ result.value.join(' -> ') }}</span>
      <span v-else class="muted">No path</span>
    </div>
  </div>
</template>

<style scoped>
.result-box {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0.75rem;
}

.result-box label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.375rem;
}

.result-value {
  font-family: monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

.algo-tag {
  background: #f0f0f0;
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
  margin-right: 0.375rem;
  font-size: 0.65rem;
}

.muted {
  color: #888;
}
</style>
