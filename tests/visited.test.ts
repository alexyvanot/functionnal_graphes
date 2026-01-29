import { VisitSet, hasVisited, markVisited } from '../src/visited';

describe('Q2 - Ensemble des noeuds visités (VisitSet)', () => {

  describe('hasVisited', () => {
    test('return false pour un noeud non visité dans un set vide', () => {
      const vs: VisitSet = {};
      expect(hasVisited(vs, 'A')).toBe(false);
    });

    test('return false pour un noeud non visité dans un set non vide', () => {
      const vs: VisitSet = { 'A': true, 'B': true };
      expect(hasVisited(vs, 'C')).toBe(false);
    });

    test('return true pour un noeud deja visité', () => {
      const vs: VisitSet = { 'A': true, 'B': true };
      expect(hasVisited(vs, 'A')).toBe(true);
    });

    test('return true pour un noeud visité parmi plusieurs', () => {
      const vs: VisitSet = { 'X': true, 'Y': true, 'Z': true };
      expect(hasVisited(vs, 'Y')).toBe(true);
    });
  });

  describe('markVisited', () => {
    test('ajoute un noeud a un set vide', () => {
      const vs: VisitSet = {};
      const result = markVisited(vs, 'A');
      expect(result).toEqual({ 'A': true });
    });

    test('ajoute un noeud a un set non vide', () => {
      const vs: VisitSet = { 'A': true };
      const result = markVisited(vs, 'B');
      expect(result).toEqual({ 'A': true, 'B': true });
    });

    test('return le meme objet si le noeud est deja visité', () => {
      const vs: VisitSet = { 'A': true, 'B': true };
      const result = markVisited(vs, 'A');
      expect(result).toBe(vs); // meme ref
    });

    test('ne modifie pas le set original (immuabilité)', () => {
      const vs: VisitSet = { 'A': true };
      const result = markVisited(vs, 'B');
      expect(vs).toEqual({ 'A': true }); // original inchangé
      expect(result).toEqual({ 'A': true, 'B': true }); // nouveau set
      expect(result).not.toBe(vs); // ref differentes
    });

    test('fonctionne avec plusieurs ajouts successifs', () => {
      const vs1: VisitSet = {};
      const vs2 = markVisited(vs1, 'A');
      const vs3 = markVisited(vs2, 'B');
      const vs4 = markVisited(vs3, 'C');
      
      expect(vs1).toEqual({});
      expect(vs2).toEqual({ 'A': true });
      expect(vs3).toEqual({ 'A': true, 'B': true });
      expect(vs4).toEqual({ 'A': true, 'B': true, 'C': true });
    });
  });

  describe('intégration hasVisited + markVisited', () => {
    test('hasVisited return true après markVisited', () => {
      const vs1: VisitSet = {};
      expect(hasVisited(vs1, 'A')).toBe(false);
      
      const vs2 = markVisited(vs1, 'A');
      expect(hasVisited(vs2, 'A')).toBe(true);
    });

    test('simulation de parcours de graphe', () => {
      let visited: VisitSet = {};
      
      // Visite A
      expect(hasVisited(visited, 'A')).toBe(false);
      visited = markVisited(visited, 'A');
      
      // Visite B
      expect(hasVisited(visited, 'B')).toBe(false);
      visited = markVisited(visited, 'B');
      
      // Tentative de revisiter A (cycle detecte)
      expect(hasVisited(visited, 'A')).toBe(true);
      
      // Visite C
      expect(hasVisited(visited, 'C')).toBe(false);
      visited = markVisited(visited, 'C');
      
      expect(visited).toEqual({ 'A': true, 'B': true, 'C': true });
    });
  });

});
