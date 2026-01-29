import { reachableDFS } from '../src/dfs';
import { Graph } from '../src/types';

describe('Q3 - Atteignabilité par DFS', () => {

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
    test('A peut atteindre C', () => {
      expect(reachableDFS(linearGraph, 'A', 'C')).toBe(true);
    });

    test('A peut atteindre B', () => {
      expect(reachableDFS(linearGraph, 'A', 'B')).toBe(true);
    });

    test('A peut atteindre A (lui-même)', () => {
      expect(reachableDFS(linearGraph, 'A', 'A')).toBe(true);
    });

    test('C ne peut pas atteindre A (sens inverse)', () => {
      expect(reachableDFS(linearGraph, 'C', 'A')).toBe(false);
    });

    test('B ne peut pas atteindre A', () => {
      expect(reachableDFS(linearGraph, 'B', 'A')).toBe(false);
    });
  });

  describe('Graphe avec embranchements', () => {
    test('A peut atteindre D (via B)', () => {
      expect(reachableDFS(branchingGraph, 'A', 'D')).toBe(true);
    });

    test('A peut atteindre E (via C)', () => {
      expect(reachableDFS(branchingGraph, 'A', 'E')).toBe(true);
    });

    test('B ne peut pas atteindre E (branche différente)', () => {
      expect(reachableDFS(branchingGraph, 'B', 'E')).toBe(false);
    });

    test('D ne peut atteindre personne (feuille)', () => {
      expect(reachableDFS(branchingGraph, 'D', 'A')).toBe(false);
      expect(reachableDFS(branchingGraph, 'D', 'E')).toBe(false);
    });
  });

  describe('Graphe avec cycle (A -> B -> C -> A)', () => {
    test('A peut atteindre C malgré le cycle', () => {
      expect(reachableDFS(cyclicGraph, 'A', 'C')).toBe(true);
    });

    test('C peut atteindre A (grâce au cycle)', () => {
      expect(reachableDFS(cyclicGraph, 'C', 'A')).toBe(true);
    });

    test('B peut atteindre A (grâce au cycle)', () => {
      expect(reachableDFS(cyclicGraph, 'B', 'A')).toBe(true);
    });

    test('ne boucle pas infiniment (gestion du cycle)', () => {
      // Si le cycle n\'est pas géré, ce test timeout
      expect(reachableDFS(cyclicGraph, 'A', 'Z')).toBe(false);
    });
  });

  describe('Graphe déconnecté', () => {
    test('A peut atteindre B', () => {
      expect(reachableDFS(disconnectedGraph, 'A', 'B')).toBe(true);
    });

    test('A ne peut pas atteindre C (composante déconnectée)', () => {
      expect(reachableDFS(disconnectedGraph, 'A', 'C')).toBe(false);
    });

    test('A ne peut pas atteindre D (composante déconnectée)', () => {
      expect(reachableDFS(disconnectedGraph, 'A', 'D')).toBe(false);
    });

    test('C peut atteindre D', () => {
      expect(reachableDFS(disconnectedGraph, 'C', 'D')).toBe(true);
    });
  });

  describe('Graphe complexe avec cycles', () => {
    test('A peut atteindre F', () => {
      expect(reachableDFS(complexGraph, 'A', 'F')).toBe(true);
    });

    test('F peut atteindre E (via cycle F -> C -> E)', () => {
      expect(reachableDFS(complexGraph, 'F', 'E')).toBe(true);
    });

    test('D ne peut atteindre personne (feuille)', () => {
      expect(reachableDFS(complexGraph, 'D', 'A')).toBe(false);
    });

    test('gère les cycles complexes sans boucle infinie', () => {
      expect(reachableDFS(complexGraph, 'A', 'Z')).toBe(false);
    });
  });

  describe('Cas limites', () => {
    test('noeud inexistant comme start', () => {
      expect(reachableDFS(linearGraph, 'Z', 'A')).toBe(false);
    });

    test('graphe vide', () => {
      const emptyGraph: Graph = { adj: {} };
      expect(reachableDFS(emptyGraph, 'A', 'B')).toBe(false);
    });

    test('start === target sur noeud isolé', () => {
      const isolatedGraph: Graph = { adj: { 'A': [] } };
      expect(reachableDFS(isolatedGraph, 'A', 'A')).toBe(true);
    });
  });

});
