import { findPathDFS } from '../src/dfs';
import { Graph } from '../src/types';

describe('Q5 - Trouver un chemin par DFS', () => {

  // Graphe simple : A -> B -> C
  const linearGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [{ to: 'C', cost: 1 }],
      'C': [],
    }
  };

  // Graphe avec embranchements :
  //     A
  //    / \
  //   B   C
  //   |   |
  //   D   E
  const branchingGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }],
      'B': [{ to: 'D', cost: 1 }],
      'C': [{ to: 'E', cost: 1 }],
      'D': [],
      'E': [],
    }
  };

  // Graphe avec cycle : A -> B -> C -> A
  const cyclicGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [{ to: 'C', cost: 1 }],
      'C': [{ to: 'A', cost: 1 }],
    }
  };

  // Graphe déconnecté : A -> B, C -> D (pas de lien entre les deux)
  const disconnectedGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }],
      'B': [],
      'C': [{ to: 'D', cost: 1 }],
      'D': [],
    }
  };

  // Graphe complexe avec cycle et plusieurs chemins
  //   A -> B -> D
  //   |    |
  //   v    v
  //   C -> E -> F
  //   ^         |
  //   +---------+
  const complexGraph: Graph = {
    adj: {
      'A': [{ to: 'B', cost: 1 }, { to: 'C', cost: 1 }],
      'B': [{ to: 'D', cost: 1 }, { to: 'E', cost: 1 }],
      'C': [{ to: 'E', cost: 1 }],
      'D': [],
      'E': [{ to: 'F', cost: 1 }],
      'F': [{ to: 'C', cost: 1 }],  // Cycle F -> C
    }
  };

  describe('Graphe linéaire (A -> B -> C)', () => {
    test('trouve le chemin A -> C', () => {
      const path = findPathDFS(linearGraph, 'A', 'C');
      expect(path).toEqual(['A', 'B', 'C']);
    });

    test('trouve le chemin A -> B', () => {
      const path = findPathDFS(linearGraph, 'A', 'B');
      expect(path).toEqual(['A', 'B']);
    });

    test('trouve le chemin A -> A (lui-même)', () => {
      const path = findPathDFS(linearGraph, 'A', 'A');
      expect(path).toEqual(['A']);
    });

    test('retourne null si chemin impossible (C -> A)', () => {
      const path = findPathDFS(linearGraph, 'C', 'A');
      expect(path).toBe(null);
    });
  });

  describe('Graphe avec embranchements', () => {
    test('trouve un chemin A -> D', () => {
      const path = findPathDFS(branchingGraph, 'A', 'D');
      expect(path).not.toBe(null);
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('D');
    });

    test('trouve un chemin A -> E', () => {
      const path = findPathDFS(branchingGraph, 'A', 'E');
      expect(path).not.toBe(null);
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('E');
    });

    test('retourne null pour B -> E (branche différente)', () => {
      const path = findPathDFS(branchingGraph, 'B', 'E');
      expect(path).toBe(null);
    });
  });

  describe('Graphe avec cycle (A -> B -> C -> A)', () => {
    test('trouve un chemin A -> C malgré le cycle', () => {
      const path = findPathDFS(cyclicGraph, 'A', 'C');
      expect(path).toEqual(['A', 'B', 'C']);
    });

    test('trouve un chemin C -> A (grâce au cycle)', () => {
      const path = findPathDFS(cyclicGraph, 'C', 'A');
      expect(path).toEqual(['C', 'A']);
    });

    test('ne boucle pas infiniment sur noeud inexistant', () => {
      const path = findPathDFS(cyclicGraph, 'A', 'Z');
      expect(path).toBe(null);
    });
  });

  describe('Graphe déconnecté', () => {
    test('trouve un chemin A -> B', () => {
      const path = findPathDFS(disconnectedGraph, 'A', 'B');
      expect(path).toEqual(['A', 'B']);
    });

    test('retourne null pour A -> C (composante déconnectée)', () => {
      const path = findPathDFS(disconnectedGraph, 'A', 'C');
      expect(path).toBe(null);
    });

    test('retourne null pour A -> D (composante déconnectée)', () => {
      const path = findPathDFS(disconnectedGraph, 'A', 'D');
      expect(path).toBe(null);
    });

    test('trouve un chemin C -> D', () => {
      const path = findPathDFS(disconnectedGraph, 'C', 'D');
      expect(path).toEqual(['C', 'D']);
    });
  });

  describe('Graphe complexe avec cycles', () => {
    test('trouve un chemin A -> F', () => {
      const path = findPathDFS(complexGraph, 'A', 'F');
      expect(path).not.toBe(null);
      expect(path![0]).toBe('A');
      expect(path![path!.length - 1]).toBe('F');
    });

    test('le chemin trouvé est valide (noeuds consécutifs connectés)', () => {
      const path = findPathDFS(complexGraph, 'A', 'F');
      expect(path).not.toBe(null);
      
      // Vérifier que chaque noeud est bien connecté au suivant
      const isValidPath = (p: string[], index: number): boolean => {
        return index >= p.length - 1
          ? true
          : (complexGraph.adj[p[index]]?.some(e => e.to === p[index + 1]) ?? false)
            && isValidPath(p, index + 1);
      };
      
      expect(isValidPath(path!, 0)).toBe(true);
    });

    test('gère les cycles complexes sans boucle infinie', () => {
      const path = findPathDFS(complexGraph, 'A', 'Z');
      expect(path).toBe(null);
    });
  });

  describe('Cas limites', () => {
    test('noeud inexistant comme start', () => {
      const path = findPathDFS(linearGraph, 'Z', 'A');
      expect(path).toBe(null);
    });

    test('graphe vide', () => {
      const emptyGraph: Graph = { adj: {} };
      const path = findPathDFS(emptyGraph, 'A', 'B');
      expect(path).toBe(null);
    });

    test('start === target sur noeud isolé', () => {
      const isolatedGraph: Graph = { adj: { 'A': [] } };
      const path = findPathDFS(isolatedGraph, 'A', 'A');
      expect(path).toEqual(['A']);
    });
  });

});
