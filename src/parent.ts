// Q4 - Table des parents et rebuild de path
// enregistre pour chaque node decouvert son parent pour rebuild le chemin

import { NodeId } from './types';
import { isEmpty, head, tail, prepend } from './list-utils';

/**
 * Type représentant la table des parents
 * Chaque node pointe vers son parent (ou null pour le start)
 */
export type ParentMap = { [node: string]: NodeId | null };

/**
 * Vérifie si un node a un parent enregistré dans la table
 */
export const hasParent = (pm: ParentMap, n: NodeId): boolean => {
  return n in pm;
};

/**
 * Fixe le parent d'un node seulement si child n'a pas encore de parent
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
 * rebuild le path [start, ..., target] depuis la table des parents
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
   * @param current - node courant
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
