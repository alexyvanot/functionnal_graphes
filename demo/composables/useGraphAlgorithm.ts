import { ref, computed } from 'vue';
import type { Graph } from '../../src/types';
import type { AnimationState, Algorithm, Result, Step } from '../types';
import { reachableDFS, findPathDFS } from '../../src/dfs';
import { shortestPathBFS } from '../../src/bfs';

export function useGraphAlgorithm(
  graph: () => Graph,
  startNode: () => string,
  targetNode: () => string,
  algorithm: () => Algorithm
) {
  const state = ref<AnimationState>({
    isRunning: false,
    isPaused: false,
    visitedNodes: [],
    queuedNodes: [],
    pathNodes: [],
    currentNode: null,
    steps: [],
    currentStepIndex: -1,
  });

  const speed = ref(500);

  const result = computed<Result>(() => {
    const g = graph();
    const start = startNode();
    const target = targetNode();

    switch (algorithm()) {
      case 'reachable':
        return { type: 'reachable', value: reachableDFS(g, start, target) };
      case 'dfs':
        return { type: 'path', value: findPathDFS(g, start, target), algo: 'DFS' };
      case 'bfs':
        return { type: 'path', value: shortestPathBFS(g, start, target), algo: 'BFS' };
    }
  });

  const currentStep = computed<Step | null>(() => {
    if (state.value.currentStepIndex < 0 || state.value.currentStepIndex >= state.value.steps.length) {
      return null;
    }
    return state.value.steps[state.value.currentStepIndex];
  });

  const nextStepPreview = computed<Step | null>(() => {
    const nextIdx = state.value.currentStepIndex + 1;
    if (nextIdx >= state.value.steps.length) {
      return null;
    }
    return state.value.steps[nextIdx];
  });

  const reset = (): void => {
    state.value = {
      isRunning: false,
      isPaused: false,
      visitedNodes: [],
      queuedNodes: [],
      pathNodes: [],
      currentNode: null,
      steps: [],
      currentStepIndex: -1,
    };
  };

  const stop = (): void => {
    state.value.isRunning = false;
    state.value.isPaused = false;
  };

  const generateDFSSteps = (g: Graph, start: string, target: string): Step[] => {
    const steps: Step[] = [];
    const visited = new Set<string>();
    
    const dfs = (current: string, path: string[]): boolean => {
      visited.add(current);
      
      steps.push({
        node: current,
        action: 'visit',
        description: `Visiting node ${current}. Adding to visited set.`,
        visited: [...visited],
        path: [...path, current],
      });

      if (current === target) {
        steps.push({
          node: current,
          action: 'found',
          description: `Target ${target} found! Path: ${[...path, current].join(' -> ')}`,
          visited: [...visited],
          path: [...path, current],
        });
        return true;
      }

      const neighbors = g.adj[current] || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          steps.push({
            node: current,
            action: 'check',
            description: `From ${current}, exploring neighbor ${edge.to}.`,
            visited: [...visited],
            path: [...path, current],
          });
          
          if (dfs(edge.to, [...path, current])) {
            return true;
          }
        }
      }

      steps.push({
        node: current,
        action: 'backtrack',
        description: `Dead end at ${current}. Backtracking...`,
        visited: [...visited],
        path: path,
      });
      
      return false;
    };

    dfs(start, []);
    return steps;
  };

  const generateBFSSteps = (g: Graph, start: string, target: string): Step[] => {
    const steps: Step[] = [];
    const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];
    const visited = new Set<string>([start]);

    steps.push({
      node: start,
      action: 'enqueue',
      description: `Start BFS from ${start}. Queue: [${start}]`,
      visited: [...visited],
      queue: [start],
      path: [start],
    });

    while (queue.length > 0) {
      const { node: current, path } = queue.shift()!;

      steps.push({
        node: current,
        action: 'visit',
        description: `Dequeue ${current}. Checking if target...`,
        visited: [...visited],
        queue: queue.map(q => q.node),
        path,
      });

      if (current === target) {
        steps.push({
          node: current,
          action: 'found',
          description: `Target found! Shortest path: ${path.join(' -> ')}`,
          visited: [...visited],
          queue: queue.map(q => q.node),
          path,
        });
        break;
      }

      const neighbors = g.adj[current] || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push({ node: edge.to, path: [...path, edge.to] });
          
          steps.push({
            node: edge.to,
            action: 'enqueue',
            description: `Enqueue ${edge.to}. Queue: [${queue.map(q => q.node).join(', ')}]`,
            visited: [...visited],
            queue: queue.map(q => q.node),
            path: [...path, edge.to],
          });
        }
      }
    }

    return steps;
  };

  const applyStep = (stepIndex: number, onUpdate: () => void): void => {
    if (stepIndex < 0 || stepIndex >= state.value.steps.length) return;
    
    const step = state.value.steps[stepIndex];
    state.value.currentStepIndex = stepIndex;
    state.value.visitedNodes = step.visited;
    state.value.queuedNodes = step.queue || [];
    state.value.currentNode = step.node;
    
    if (step.action === 'found' && step.path) {
      state.value.pathNodes = step.path;
    } else {
      state.value.pathNodes = [];
    }
    
    onUpdate();
  };

  const stepForward = (onUpdate: () => void): void => {
    const nextIdx = state.value.currentStepIndex + 1;
    if (nextIdx < state.value.steps.length) {
      applyStep(nextIdx, onUpdate);
    }
  };

  const stepBackward = (onUpdate: () => void): void => {
    const prevIdx = state.value.currentStepIndex - 1;
    if (prevIdx >= 0) {
      applyStep(prevIdx, onUpdate);
    }
  };

  const pause = (): void => {
    state.value.isPaused = true;
  };

  const resume = (): void => {
    state.value.isPaused = false;
  };

  const runStepByStep = (onUpdate: () => void): void => {
    reset();
    
    const g = graph();
    const start = startNode();
    const target = targetNode();
    const algo = algorithm();

    if (algo === 'bfs') {
      state.value.steps = generateBFSSteps(g, start, target);
    } else {
      state.value.steps = generateDFSSteps(g, start, target);
    }

    state.value.isRunning = true;
    state.value.isPaused = true;
    state.value.currentStepIndex = -1;
    
    if (state.value.steps.length > 0) {
      applyStep(0, onUpdate);
    }
  };

  const run = async (onUpdate: () => void): Promise<void> => {
    runStepByStep(onUpdate);
    
    state.value.isPaused = false;
    
    while (
      state.value.isRunning && 
      !state.value.isPaused && 
      state.value.currentStepIndex < state.value.steps.length - 1
    ) {
      await new Promise(resolve => setTimeout(resolve, speed.value));
      
      if (!state.value.isPaused && state.value.isRunning) {
        stepForward(onUpdate);
      }
    }

    if (!state.value.isPaused) {
      state.value.isRunning = false;
    }
  };

  return {
    state,
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
  };
}
