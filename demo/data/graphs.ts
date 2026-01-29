import type { Graph } from '../../src/types';
import type { GraphOption, AlgorithmOption } from '../types';

export const GRAPHS: GraphOption[] = [
  {
    key: 'sample',
    label: 'Sample',
    graph: {
      adj: {
        A: [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }],
        B: [{ to: 'D', cost: 1 }],
        C: [{ to: 'D', cost: 1 }, { to: 'E', cost: 1 }],
        D: [],
        E: [],
      }
    }
  },
  {
    key: 'linear',
    label: 'Linear',
    graph: {
      adj: {
        '1': [{ to: '2', cost: 1 }],
        '2': [{ to: '3', cost: 1 }],
        '3': [{ to: '4', cost: 1 }],
        '4': [{ to: '5', cost: 1 }],
        '5': [],
      }
    }
  },
  {
    key: 'cyclic',
    label: 'Cyclic',
    graph: {
      adj: {
        X: [{ to: 'Y', cost: 1 }],
        Y: [{ to: 'Z', cost: 1 }],
        Z: [{ to: 'X', cost: 1 }, { to: 'W', cost: 1 }],
        W: [],
      }
    }
  },
  {
    key: 'complex',
    label: 'Complex',
    graph: {
      adj: {
        S: [{ to: 'A', cost: 1 }, { to: 'B', cost: 1 }],
        A: [{ to: 'C', cost: 1 }],
        B: [{ to: 'C', cost: 1 }, { to: 'D', cost: 1 }],
        C: [{ to: 'E', cost: 1 }],
        D: [{ to: 'E', cost: 1 }],
        E: [],
      }
    }
  },
  {
    key: 'unreachable',
    label: 'Unreachable',
    graph: {
      adj: {
        A: [{ to: 'B', cost: 1 }],
        B: [{ to: 'C', cost: 1 }],
        C: [],
        X: [{ to: 'Y', cost: 1 }],
        Y: [{ to: 'Z', cost: 1 }],
        Z: [],
      }
    }
  },
];

export const ALGORITHMS: AlgorithmOption[] = [
  { value: 'reachable', label: 'Q3: Reachable' },
  { value: 'dfs', label: 'Q5: DFS Path' },
  { value: 'bfs', label: 'Q6: BFS Shortest' },
];

export const getGraphByKey = (key: string): Graph => {
  const found = GRAPHS.find(g => g.key === key);
  return found ? found.graph : GRAPHS[0].graph;
};

export const getNodes = (graph: Graph): string[] => Object.keys(graph.adj);
