import type { Graph } from '../../src/types';

export interface GraphOption {
  key: string;
  label: string;
  graph: Graph;
}

export interface Step {
  node: string;
  action: 'visit' | 'check' | 'found' | 'backtrack' | 'enqueue';
  description: string;
  visited: string[];
  queue?: string[];
  path?: string[];
}

export interface AnimationState {
  isRunning: boolean;
  isPaused: boolean;
  visitedNodes: string[];
  queuedNodes: string[];
  pathNodes: string[];
  currentNode: string | null;
  steps: Step[];
  currentStepIndex: number;
}

export type Algorithm = 'reachable' | 'dfs' | 'bfs';

export interface AlgorithmOption {
  value: Algorithm;
  label: string;
}

export interface ResultReachable {
  type: 'reachable';
  value: boolean;
}

export interface ResultPath {
  type: 'path';
  value: string[] | null;
  algo: string;
}

export type Result = ResultReachable | ResultPath;
