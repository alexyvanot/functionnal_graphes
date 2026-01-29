// Q2 - Ensemble des noeuds visités (visited)
// Gestion immuable des noeuds déjà traités pour éviter les cycles

import { NodeId } from './types';

/**
 * Type représentant l'ensemble des noeuds visités
 * Utilise un objet avec des clés string et valeur true
 */
export type VisitSet = { [node: string]: true };

/**
 * check si un noeud a deja ete visité
 */
export const hasVisited = (vs: VisitSet, n: NodeId): boolean => {
  return vs[n] === true;
};

/**
 * Marque un noeud comme visité en retournant un NOUVEL objet
 * Ne modifie jamais l'objet vs original (immutabilité)
 * 
 * algo:
 * - si déjà présent => return vs
 * - sinon => return { ...vs, [n]: true }
 */
export const markVisited = (vs: VisitSet, n: NodeId): VisitSet => {
  return hasVisited(vs, n)
    ? vs
    : { ...vs, [n]: true };
};
