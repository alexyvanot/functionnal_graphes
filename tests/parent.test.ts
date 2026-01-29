import { ParentMap, hasParent, setParent, buildPathFromParents } from '../src/parent';

describe('Q4 - Table des parents + reconstruction de chemin', () => {

  describe('hasParent', () => {
    test('retourne false pour un noeud absent de la table', () => {
      const pm: ParentMap = {};
      expect(hasParent(pm, 'A')).toBe(false);
    });

    test('retourne true pour un noeud présent avec parent non-null', () => {
      const pm: ParentMap = { 'B': 'A' };
      expect(hasParent(pm, 'B')).toBe(true);
    });

    test('retourne true pour un noeud présent avec parent null (start)', () => {
      const pm: ParentMap = { 'A': null };
      expect(hasParent(pm, 'A')).toBe(true);
    });

    test('retourne false pour un noeud non présent dans une table non vide', () => {
      const pm: ParentMap = { 'A': null, 'B': 'A' };
      expect(hasParent(pm, 'C')).toBe(false);
    });
  });

  describe('setParent', () => {
    test('ajoute un parent à une table vide', () => {
      const pm: ParentMap = {};
      const result = setParent(pm, 'A', null);
      expect(result).toEqual({ 'A': null });
    });

    test('ajoute un parent à une table non vide', () => {
      const pm: ParentMap = { 'A': null };
      const result = setParent(pm, 'B', 'A');
      expect(result).toEqual({ 'A': null, 'B': 'A' });
    });

    test('ne modifie pas si le child a déjà un parent', () => {
      const pm: ParentMap = { 'A': null, 'B': 'A' };
      const result = setParent(pm, 'B', 'X');
      expect(result).toBe(pm); // même référence
      expect(result).toEqual({ 'A': null, 'B': 'A' }); // B garde son parent A
    });

    test('ne modifie pas la table originale (immutabilité)', () => {
      const pm: ParentMap = { 'A': null };
      const result = setParent(pm, 'B', 'A');
      expect(pm).toEqual({ 'A': null }); // original inchangé
      expect(result).toEqual({ 'A': null, 'B': 'A' });
    });

    test('permet de chaîner plusieurs setParent', () => {
      const pm1: ParentMap = {};
      const pm2 = setParent(pm1, 'A', null);
      const pm3 = setParent(pm2, 'B', 'A');
      const pm4 = setParent(pm3, 'C', 'B');
      
      expect(pm1).toEqual({});
      expect(pm2).toEqual({ 'A': null });
      expect(pm3).toEqual({ 'A': null, 'B': 'A' });
      expect(pm4).toEqual({ 'A': null, 'B': 'A', 'C': 'B' });
    });
  });

  describe('buildPathFromParents', () => {
    test('retourne [start] si start === target', () => {
      const pm: ParentMap = { 'A': null };
      expect(buildPathFromParents(pm, 'A', 'A')).toEqual(['A']);
    });

    test('retourne [start] même si la table est vide quand start === target', () => {
      const pm: ParentMap = {};
      expect(buildPathFromParents(pm, 'A', 'A')).toEqual(['A']);
    });

    test('reconstruit un chemin simple A -> B', () => {
      const pm: ParentMap = { 'A': null, 'B': 'A' };
      expect(buildPathFromParents(pm, 'A', 'B')).toEqual(['A', 'B']);
    });

    test('reconstruit un chemin A -> B -> C', () => {
      const pm: ParentMap = { 'A': null, 'B': 'A', 'C': 'B' };
      expect(buildPathFromParents(pm, 'A', 'C')).toEqual(['A', 'B', 'C']);
    });

    test('reconstruit un chemin long A -> B -> C -> D -> E', () => {
      const pm: ParentMap = { 
        'A': null, 
        'B': 'A', 
        'C': 'B', 
        'D': 'C', 
        'E': 'D' 
      };
      expect(buildPathFromParents(pm, 'A', 'E')).toEqual(['A', 'B', 'C', 'D', 'E']);
    });

    test('retourne null si target n\'a pas de parent', () => {
      const pm: ParentMap = { 'A': null, 'B': 'A' };
      expect(buildPathFromParents(pm, 'A', 'C')).toBe(null);
    });

    test('retourne null pour une table vide avec start !== target', () => {
      const pm: ParentMap = {};
      expect(buildPathFromParents(pm, 'A', 'B')).toBe(null);
    });

    test('gère un graphe avec plusieurs branches', () => {
      // A -> B -> D
      // A -> C -> E
      const pm: ParentMap = { 
        'A': null, 
        'B': 'A', 
        'C': 'A', 
        'D': 'B', 
        'E': 'C' 
      };
      expect(buildPathFromParents(pm, 'A', 'D')).toEqual(['A', 'B', 'D']);
      expect(buildPathFromParents(pm, 'A', 'E')).toEqual(['A', 'C', 'E']);
    });

    test('retourne null si le chemin est cassé (parent manquant)', () => {
      // B a un parent C mais C n'a pas de parent vers A
      const pm: ParentMap = { 'A': null, 'B': 'C' };
      expect(buildPathFromParents(pm, 'A', 'B')).toBe(null);
    });
  });

});
