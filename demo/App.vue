<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { Algorithm } from './types';
import { getGraphByKey, getNodes } from './data/graphs';
import { useGraphAlgorithm } from './composables/useGraphAlgorithm';
import { useCytoscape } from './composables/useCytoscape';

import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ControlPanel from './components/ControlPanel.vue';
import GraphCanvas from './components/GraphCanvas.vue';
import ResultBox from './components/ResultBox.vue';
import GraphLegend from './components/GraphLegend.vue';
import StepDebugger from './components/StepDebugger.vue';

// State
const selectedGraph = ref('sample');
const startNode = ref('A');
const targetNode = ref('E');
const algorithm = ref<Algorithm>('bfs');

// Computed
const currentGraph = computed(() => getGraphByKey(selectedGraph.value));
const nodes = computed(() => getNodes(currentGraph.value));

// Composables
const {
  state: animationState,
  speed,
  result,
  currentStep,
  nextStepPreview,
  run,
  runStepByStep,
  stop,
  reset,
  pause,
  resume,
  stepForward,
  stepBackward,
} = useGraphAlgorithm(
  () => currentGraph.value,
  () => startNode.value,
  () => targetNode.value,
  () => algorithm.value
);

const { updateClasses, rebuild, setContainer } = useCytoscape(
  () => currentGraph.value,
  () => startNode.value,
  () => targetNode.value
);

// Handlers
const handleRun = () => run(() => updateClasses(animationState.value));
const handleStep = () => runStepByStep(() => updateClasses(animationState.value));
const handleStepForward = () => stepForward(() => updateClasses(animationState.value));
const handleStepBackward = () => stepBackward(() => updateClasses(animationState.value));

const handleReset = () => {
  reset();
  updateClasses(animationState.value);
};

const handleCanvasReady = (el: HTMLDivElement) => {
  setContainer(el);
};

// Watchers
watch(selectedGraph, () => {
  const newNodes = getNodes(getGraphByKey(selectedGraph.value));
  startNode.value = newNodes[0];
  targetNode.value = newNodes[newNodes.length - 1];
  handleReset();
  nextTick(rebuild);
});

watch([startNode, targetNode], () => {
  handleReset();
});
</script>

<template>
  <div class="app">
    <AppHeader />

    <div class="layout">
      <ControlPanel
        v-model:selectedGraph="selectedGraph"
        v-model:startNode="startNode"
        v-model:targetNode="targetNode"
        v-model:algorithm="algorithm"
        v-model:speed="speed"
        :nodes="nodes"
        :isAnimating="animationState.isRunning"
        @run="handleRun"
        @step="handleStep"
        @stop="stop"
        @reset="handleReset"
      >
        <template #result>
          <ResultBox :result="result" />
        </template>
        <template #debugger>
          <StepDebugger
            :currentStep="currentStep"
            :nextStep="nextStepPreview"
            :stepIndex="animationState.currentStepIndex"
            :totalSteps="animationState.steps.length"
            :isPaused="animationState.isPaused"
            :isRunning="animationState.isRunning"
            @stepForward="handleStepForward"
            @stepBackward="handleStepBackward"
            @pause="pause"
            @resume="resume"
          />
        </template>
        <template #legend>
          <GraphLegend />
        </template>
      </ControlPanel>

      <GraphCanvas @ready="handleCanvasReady" />
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.layout {
  display: flex;
  gap: 1.5rem;
}
</style>
