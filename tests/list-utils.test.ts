import { isEmpty, head, tail, prepend, append, concat } from '../src/list-utils';

describe('Q1 - utils list', () => {
  
  describe('isEmpty', () => {
    test('return true pour une liste vide', () => {
      expect(isEmpty([])).toBe(true);
    });

    test('return false pour une liste non vide', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    test('return false pour une liste avec un seul élément', () => {
      expect(isEmpty([42])).toBe(false);
    });
  });

  describe('head', () => {
    test('return le premier element d\'une liste de nombres', () => {
      expect(head([1, 2, 3])).toBe(1);
    });

    test('return le premier element d\'une liste de strings', () => {
      expect(head(['a', 'b', 'c'])).toBe('a');
    });

    test('return l\'unique élement d\'une liste singleton', () => {
      expect(head([42])).toBe(42);
    });
  });

  describe('tail', () => {
    test('return la liste sans le premier élément', () => {
      expect(tail([1, 2, 3])).toEqual([2, 3]);
    });

    test('return une liste vide pour une liste singleton', () => {
      expect(tail([1])).toEqual([]);
    });

    test('fonctionne avec des strings', () => {
      expect(tail(['a', 'b', 'c'])).toEqual(['b', 'c']);
    });
  });

  describe('prepend', () => {
    test('ajoute un élément au début d\'une liste', () => {
      expect(prepend(0, [1, 2, 3])).toEqual([0, 1, 2, 3]);
    });

    test('ajoute un element a une liste vide', () => {
      expect(prepend('x', [])).toEqual(['x']);
    });

    test('ne modifie pas la liste originale (check sur l\'immutabilité)', () => {
      const original = [1, 2, 3];
      const result = prepend(0, original);
      expect(original).toEqual([1, 2, 3]);
      expect(result).toEqual([0, 1, 2, 3]);
    });
  });

  describe('append', () => {
    test('ajoute un elément à la fin d\'une liste', () => {
      expect(append([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
    });

    test('ajoute un element a une liste vide', () => {
      expect(append([], 'x')).toEqual(['x']);
    });

    test('ne modifie pas la liste originale (check sur l\'immutabilité)', () => {
      const original = [1, 2, 3];
      const result = append(original, 4);
      expect(original).toEqual([1, 2, 3]);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('concat', () => {
    test('concatène deux listes non vides', () => {
      expect(concat([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    test('concatène une liste vide avec une liste non vide', () => {
      expect(concat([], [1, 2])).toEqual([1, 2]);
    });

    test('concatène une liste non vide avec une liste vide', () => {
      expect(concat([1, 2], [])).toEqual([1, 2]);
    });

    test('concatène deux listes vides', () => {
      expect(concat([], [])).toEqual([]);
    });

    test('ne modifie pas les listes originale (imutabilité)', () => {
      const a = [1, 2];
      const b = [3, 4];
      const result = concat(a, b);
      expect(a).toEqual([1, 2]);
      expect(b).toEqual([3, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    test('fonctionne avec des strings', () => {
      expect(concat(['a', 'b'], ['c', 'd'])).toEqual(['a', 'b', 'c', 'd']);
    });
  });

});
