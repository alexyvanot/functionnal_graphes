// Q4 - Table des parents et reconstruction de path
// enregistre pour chaque noeud découvert son parent pour reconstruire le chemin

import { NodeId } from './types';
import { isEmpty, head, tail, prepend } from './list-utils';

/**
 * Type représentant la table des parents
 * Chaque noeud pointe vers son parent (ou null pour le start)
 */
export type ParentMap = { [node: string]: NodeId | null };

/**
 * Vérifie si un noeud a un parent enregistré dans la table
 */
export const hasParent = (pm: ParentMap, n: NodeId): boolean => {
  return n in pm;
};

/**
 * Fixe le parent d'un noeud seulement si child n'a pas encore de parent
 * return un new object (immutabilité)
 */
export const setParent = (
  pm: ParentMap,
  child: NodeId,
  parent: NodeId | null
): ParentMap => {
  return hasParent(pm, child)
    ? pm
    : { ...pm, [child]: parent };
};

/**
 * Inverse une list de manière récursive
 * reverse([1,2,3]) = [3,2,1]
 */
const reverse = <T>(xs: T[]): T[] => {
  const go = (remaining: T[], acc: T[]): T[] => {
    return isEmpty(remaining)
      ? acc
      : go(tail(remaining), prepend(head(remaining), acc));
  };
  return go(xs, []);
};

/**
 * Reconstruit le chemin [start, ..., target] depuis la table des parents
 * return null si target n'est pas atteignable
 * 
 * algo:
 * - si target === start : return [start]
 * - si target n'a pas de parent enregistré : return null
 * - sinon : remonte récursivement et construit la liste à l'envers, puis inverse
 */
export const buildPathFromParents = (
  pm: ParentMap,
  start: NodeId,
  target: NodeId
): NodeId[] | null => {
  
  /**
   * Remonte de current vers start en accumulant le chemin
   * @param current - noeud courant
   * @param acc - accumulateur du chemin (reverse built)
   */
  const go = (current: NodeId, acc: NodeId[]): NodeId[] | null => {
    return current === start
      ? prepend(start, acc)
      : (
          !hasParent(pm, current)
            ? null
            : go(pm[current]!, prepend(current, acc))
        );
  };
  
  // start === target ; dans les cas spécifique
  return start === target
    ? [start]
    : go(target, []);
};
