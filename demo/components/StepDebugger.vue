<script setup lang="ts">
import type { Step } from '../types';

defineProps<{
  currentStep: Step | null;
  nextStep: Step | null;
  stepIndex: number;
  totalSteps: number;
  isPaused: boolean;
  isRunning: boolean;
}>();

const emit = defineEmits<{
  stepForward: [];
  stepBackward: [];
  pause: [];
  resume: [];
}>();

const getActionLabel = (action: string): string => {
  switch (action) {
    case 'visit': return 'VISIT';
    case 'check': return 'CHECK';
    case 'found': return 'FOUND';
    case 'backtrack': return 'BACK';
    case 'enqueue': return 'QUEUE';
    default: return action.toUpperCase();
  }
};
</script>

<template>
  <div class="debugger">
    <div class="debugger-header">
      <label>Debugger</label>
      <span class="step-counter" v-if="totalSteps > 0">
        {{ stepIndex + 1 }} / {{ totalSteps }}
      </span>
    </div>

    <div class="step-controls" v-if="isRunning">
      <button 
        @click="emit('stepBackward')" 
        :disabled="stepIndex <= 0"
        class="step-btn"
      >
        &lt;
      </button>
      
      <button 
        v-if="isPaused"
        @click="emit('resume')" 
        class="play-btn"
      >
        Play
      </button>
      <button 
        v-else
        @click="emit('pause')" 
        class="play-btn"
      >
        Pause
      </button>
      
      <button 
        @click="emit('stepForward')" 
        :disabled="stepIndex >= totalSteps - 1"
        class="step-btn"
      >
        &gt;
      </button>
    </div>

    <div class="current-step" v-if="currentStep">
      <div class="step-label">
        <span class="action-badge" :class="currentStep.action">
          {{ getActionLabel(currentStep.action) }}
        </span>
        <span class="node-badge">{{ currentStep.node }}</span>
      </div>
      <p class="step-description">{{ currentStep.description }}</p>
      
      <div class="step-data">
        <div class="data-row">
          <span class="data-label">Visited:</span>
          <span class="data-value">{{ currentStep.visited.join(', ') || '-' }}</span>
        </div>
        <div class="data-row" v-if="currentStep.queue">
          <span class="data-label">Queue:</span>
          <span class="data-value">{{ currentStep.queue.join(', ') || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="next-step" v-if="nextStep && isPaused">
      <span class="next-label">Next:</span>
      <span class="action-badge small" :class="nextStep.action">
        {{ getActionLabel(nextStep.action) }}
      </span>
      <span class="next-node">{{ nextStep.node }}</span>
    </div>

    <div class="no-step" v-if="!isRunning">
      Click "Run" or "Step" to start debugging
    </div>
  </div>
</template>

<style scoped>
.debugger {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0.75rem;
  font-size: 0.75rem;
}

.debugger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.debugger-header label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-counter {
  font-family: monospace;
  color: #666;
  font-size: 0.7rem;
}

.step-controls {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.step-btn, .play-btn {
  flex: 1;
  padding: 0.375rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
}

.step-btn:hover:not(:disabled), .play-btn:hover {
  border-color: #111;
}

.step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.play-btn {
  background: #111;
  color: #fff;
  border-color: #111;
}

.current-step {
  background: #f8f8f8;
  border-radius: 3px;
  padding: 0.5rem;
}

.step-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
}

.action-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
}

.action-badge.visit { background: #e0e0e0; color: #333; }
.action-badge.check { background: #fff3cd; color: #856404; }
.action-badge.found { background: #d4edda; color: #155724; }
.action-badge.backtrack { background: #f8d7da; color: #721c24; }
.action-badge.enqueue { background: #cce5ff; color: #004085; }

.action-badge.small {
  font-size: 0.55rem;
  padding: 0.0625rem 0.25rem;
}

.node-badge {
  font-family: monospace;
  font-weight: 600;
}

.step-description {
  color: #333;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.step-data {
  border-top: 1px solid #e0e0e0;
  padding-top: 0.375rem;
}

.data-row {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.125rem;
}

.data-label {
  color: #888;
  min-width: 50px;
}

.data-value {
  font-family: monospace;
  color: #333;
}

.next-step {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #ddd;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #888;
}

.next-label {
  font-size: 0.65rem;
  text-transform: uppercase;
}

.next-node {
  font-family: monospace;
}

.no-step {
  color: #888;
  text-align: center;
  padding: 0.5rem;
}
</style>
