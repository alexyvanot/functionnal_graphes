import { ref } from 'vue';
import cytoscape, { type Core, type ElementDefinition, type StylesheetStyle } from 'cytoscape';
import type { Graph } from '../../src/types';
import type { AnimationState } from '../types';

const CYTOSCAPE_STYLES: StylesheetStyle[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#fff',
      'border-width': 2,
      'border-color': '#111',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '14px',
      'font-weight': 'bold',
      'width': 40,
      'height': 40,
      'color': '#111'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'arrow-scale': 1.2
    }
  },
  {
    selector: 'node.start',
    style: {
      'background-color': '#111',
      'color': '#fff'
    }
  },
  {
    selector: 'node.target',
    style: {
      'border-width': 4,
      'border-style': 'double'
    }
  },
  {
    selector: 'node.queued',
    style: {
      'background-color': '#cce5ff',
      'border-color': '#004085'
    }
  },
  {
    selector: 'node.visited',
    style: {
      'background-color': '#d4edda',
      'border-color': '#155724'
    }
  },
  {
    selector: 'node.current',
    style: {
      'border-width': 4,
      'border-color': '#ff6b00',
      'border-style': 'solid'
    }
  },
  {
    selector: 'node.path',
    style: {
      'background-color': '#111',
      'color': '#fff',
      'border-color': '#111'
    }
  },
  {
    selector: 'edge.path',
    style: {
      'line-color': '#111',
      'target-arrow-color': '#111',
      'width': 3
    }
  },
  {
    selector: 'edge.visited',
    style: {
      'line-color': '#888',
      'target-arrow-color': '#888'
    }
  }
];

const buildElements = (graph: Graph): ElementDefinition[] => {
  const elements: ElementDefinition[] = [];
  const nodeList = Object.keys(graph.adj);
  const angleStep = (2 * Math.PI) / nodeList.length;

  nodeList.forEach((node, i) => {
    const angle = i * angleStep - Math.PI / 2;
    elements.push({
      data: { id: node, label: node },
      position: {
        x: 200 + 120 * Math.cos(angle),
        y: 180 + 120 * Math.sin(angle)
      }
    });
  });

  for (const [from, edges] of Object.entries(graph.adj)) {
    for (const edge of edges) {
      elements.push({
        data: {
          id: `${from}-${edge.to}`,
          source: from,
          target: edge.to
        }
      });
    }
  }

  return elements;
};

export function useCytoscape(
  graph: () => Graph,
  startNode: () => string,
  targetNode: () => string
) {
  const cyRef = ref<Core | null>(null);
  const containerRef = ref<HTMLDivElement | null>(null);

  const setContainer = (el: HTMLDivElement): void => {
    containerRef.value = el;
    init();
  };

  const init = (): void => {
    if (!containerRef.value) return;

    if (cyRef.value) {
      cyRef.value.destroy();
    }

    cyRef.value = cytoscape({
      container: containerRef.value,
      elements: buildElements(graph()),
      style: CYTOSCAPE_STYLES,
      layout: { name: 'preset' },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false
    });

    updateClasses({ visitedNodes: [], queuedNodes: [], pathNodes: [], currentNode: null, isRunning: false, isPaused: false, steps: [], currentStepIndex: -1 });
  };

  const updateClasses = (state: AnimationState): void => {
    const cy = cyRef.value;
    if (!cy) return;

    cy.nodes().removeClass('start target queued visited current path');
    cy.edges().removeClass('path visited');

    cy.getElementById(startNode()).addClass('start');
    cy.getElementById(targetNode()).addClass('target');

    // Visited nodes (already processed) - apply first
    state.visitedNodes.forEach(n => {
      cy.getElementById(n).addClass('visited');
    });

    // Queued nodes (in BFS queue, not yet visited/processed) - apply after to override visited
    state.queuedNodes.forEach(n => {
      cy.getElementById(n).removeClass('visited').addClass('queued');
    });

    if (state.currentNode) {
      cy.getElementById(state.currentNode).addClass('current');
    }

    state.pathNodes.forEach((n, i) => {
      cy.getElementById(n).addClass('path');
      if (i > 0) {
        const prevNode = state.pathNodes[i - 1];
        cy.getElementById(`${prevNode}-${n}`).addClass('path');
      }
    });
  };

  const rebuild = (): void => {
    init();
  };

  return {
    cy: cyRef,
    updateClasses,
    rebuild,
    setContainer,
  };
}
