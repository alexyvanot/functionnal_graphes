import { shortestPathBFS } from '../src/bfs';
import { reachableDFS, findPathDFS } from '../src/dfs';
import { Graph } from '../src/types';

// Graphe de test fourni dans l'énoncé
const sample: Graph = {
  adj: {
    A: [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }],
    B: [{ to: 'D', cost: 1 }],
    C: [{ to: 'D', cost: 1 }, { to: 'E', cost: 1 }],
    D: [{ to: 'B', cost: 1 }], // cycle
    E: [],
  },
};

describe('Q6 - Plus court chemin par BFS', () => {

  describe('Tests avec le graphe sample de l\'énoncé', () => {
    test('reachableDFS(sample, "A", "E") === true', () => {
      expect(reachableDFS(sample, 'A', 'E')).toBe(true);
    });

    test('reachableDFS(sample, "E", "A") === false', () => {
      expect(reachableDFS(sample, 'E', 'A')).toBe(false);
    });

    test('findPathDFS(sample, "A", "D") retourne un chemin valide', () => {
      const path = findPathDFS(sample, 'A', 'D');
      expect(path).not.toBe(null);
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('D');
    });

    test('shortestPathBFS(sample, "A", "D") retourne un chemin minimal (3 noeuds)', () => {
      const path = shortestPathBFS(sample, 'A', 'D');
      expect(path).not.toBe(null);
      expect(path!.length).toBe(3); // A -> B -> D ou A -> C -> D
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('D');
    });

    test('shortestPathBFS(sample, "A", "E") retourne [A, C, E]', () => {
      const path = shortestPathBFS(sample, 'A', 'E');
      expect(path).toEqual(['A', 'C', 'E']);
    });

    test('shortestPathBFS(sample, "E", "A") retourne null', () => {
      const path = shortestPathBFS(sample, 'E', 'A');
      expect(path).toBe(null);
    });
  });

  // Graphe linéaire : A -> B -> C -> D
  const linearGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [{ to: 'C', cost: 1 }],
      'C': [{ to: 'D', cost: 1 }],
      'D': [],
    }
  };

  describe('Graphe linéaire (A -> B -> C -> D)', () => {
    test('trouve le chemin le plus court A -> D', () => {
      const path = shortestPathBFS(linearGraph, 'A', 'D');
      expect(path).toEqual(['A', 'B', 'C', 'D']);
    });

    test('trouve le chemin A -> A', () => {
      const path = shortestPathBFS(linearGraph, 'A', 'A');
      expect(path).toEqual(['A']);
    });
  });

  // Graphe avec plusieurs chemins de longueurs différentes
  //   A ---> B ---> D
  //   |             ^
  //   +---> C ------+
  // A->B->D = 3 noeuds, A->C->D = 3 noeuds (égaux)
  // Mais si on ajoute un intermédiaire:
  //   A ---> B ---> X ---> D
  //   |                    ^
  //   +---> C -------------+
  // A->C->D = 3 noeuds (plus court), A->B->X->D = 4 noeuds
  const multiPathGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }],
      'B': [{ to: 'X', cost: 1 }],
      'X': [{ to: 'D', cost: 1 }],
      'C': [{ to: 'D', cost: 1 }],
      'D': [],
    }
  };

  describe('Graphe avec chemins de longueurs différentes', () => {
    test('BFS trouve le chemin le plus court A -> D (via C, pas via B->X)', () => {
      const path = shortestPathBFS(multiPathGraph, 'A', 'D');
      expect(path).not.toBe(null);
      expect(path!.length).toBe(3); // A -> C -> D
      expect(path).toEqual(['A', 'C', 'D']);
    });
  });

  // Graphe avec cycle : A -> B -> C -> A
  const cyclicGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [{ to: 'C', cost: 1 }],
      'C': [{ to: 'A', cost: 1 }, { to: 'D', cost: 1 }],
      'D': [],
    }
  };

  describe('Graphe avec cycle', () => {
    test('trouve le chemin sans boucler infiniment', () => {
      const path = shortestPathBFS(cyclicGraph, 'A', 'D');
      expect(path).toEqual(['A', 'B', 'C', 'D']);
    });

    test('ne boucle pas sur cible inexistante', () => {
      const path = shortestPathBFS(cyclicGraph, 'A', 'Z');
      expect(path).toBe(null);
    });
  });

  // Graphe large pour tester la minimalité
  //       A
  //      /|\
  //     B C D
  //     |   |
  //     E   F
  //      \ /
  //       G
  const wideGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }, { to: 'D', cost: 1 }],
      'B': [{ to: 'E', cost: 1 }],
      'C': [],
      'D': [{ to: 'F', cost: 1 }],
      'E': [{ to: 'G', cost: 1 }],
      'F': [{ to: 'G', cost: 1 }],
      'G': [],
    }
  };

  describe('Graphe large', () => {
    test('BFS trouve le chemin minimal vers G (3 arêtes)', () => {
      const path = shortestPathBFS(wideGraph, 'A', 'G');
      expect(path).not.toBe(null);
      expect(path!.length).toBe(4); // 4 noeuds = 3 arêtes
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('G');
    });

    test('C ne peut pas atteindre G', () => {
      const path = shortestPathBFS(wideGraph, 'C', 'G');
      expect(path).toBe(null);
    });
  });

  // Graphe déconnecté
  const disconnectedGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [],
      'C': [{ to: 'D', cost: 1 }],
      'D': [],
    }
  };

  describe('Graphe déconnecté', () => {
    test('trouve un chemin dans la même composante', () => {
      const path = shortestPathBFS(disconnectedGraph, 'A', 'B');
      expect(path).toEqual(['A', 'B']);
    });

    test('retourne null entre composantes déconnectées', () => {
      const path = shortestPathBFS(disconnectedGraph, 'A', 'D');
      expect(path).toBe(null);
    });
  });

  describe('Cas limites', () => {
    test('graphe vide', () => {
      const emptyGraph: Graph = { adj: {} };
      const path = shortestPathBFS(emptyGraph, 'A', 'B');
      expect(path).toBe(null);
    });

    test('start === target', () => {
      const path = shortestPathBFS(sample, 'A', 'A');
      expect(path).toEqual(['A']);
    });

    test('noeud inexistant', () => {
      const path = shortestPathBFS(sample, 'Z', 'A');
      expect(path).toBe(null);
    });
  });

  describe('Comparaison DFS vs BFS', () => {
    test('BFS trouve un chemin plus court ou égal à DFS', () => {
      const bfsPath = shortestPathBFS(multiPathGraph, 'A', 'D');
      const dfsPath = findPathDFS(multiPathGraph, 'A', 'D');
      
      expect(bfsPath).not.toBe(null);
      expect(dfsPath).not.toBe(null);
      expect(bfsPath!.length).toBeLessThanOrEqual(dfsPath!.length);
    });
  });

});
