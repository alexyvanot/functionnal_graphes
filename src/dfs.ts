// Q3 & Q5 - Atteignabilité et chemin par DFS (Depth-First Search)
// Parcours en profondeur pour vérifier si un noeud est atteignable

import { Graph, NodeId, neighbors } from './types';
import { VisitSet, hasVisited, markVisited } from './visited';
import { isEmpty, head, tail, concat } from './list-utils';
import { ParentMap, hasParent, setParent, buildPathFromParents } from './parent';

/**
 * extract les NodeId des voisins (arêtes/liens) d'un node
 * et utilise la récursion pour transformer Edge[] en NodeId[]
 */
const extractNodeIds = (edges: { to: NodeId }[]): NodeId[] => {
  return isEmpty(edges)
    ? []
    : [head(edges).to, ...extractNodeIds(tail(edges))];
};

/**
 * check si target est atteignable depuis start via DFS
 * 
 * algo (en pile LIFO):
 * - frontière = [start]
 * - dépiler n (lifo donc tete de pile)
 * - si n === target : succès (true)
 * - si n est visité : ignorer et continuer
 * - sinon : marquer visité et empiler ses voisins DEVANT le reste
 * - répéter jusqu'à trouver le bon target ou avoir consomé la pile (false)
 */
export const reachableDFS = (
  g: Graph,
  start: NodeId,
  target: NodeId
): boolean => {
  
  /**
   * Function récursive interne
   * @param frontier - pile des noeuds a explorer (LIFO)
   * @param visited - ensemble des noeuds deja visités
   */
  const go = (frontier: NodeId[], visited: VisitSet): boolean => {
    // Cas d'arrêt : pile vide => target non trouvé
    return isEmpty(frontier)
      ? false
      : (() => {
          const n = head(frontier);
          const rest = tail(frontier);
          
          // Si on a trouvé la cible
          return n === target
            ? true
            // Si déjà visité, on ignore et continue
            : hasVisited(visited, n)
              ? go(rest, visited)
              // Sinon, marquer visité et empiler les voisins devant
              : go(
                  concat(extractNodeIds(neighbors(g, n)), rest),
                  markVisited(visited, n)
                );
        })();
  };
  
  // start le parcours avec la frontière du début : [start] et visited vide
  return go([start], {});
};

/**
 * Q5 - Trouve un chemin valide (mais pas forcément le plus court) de start à target
 * Utilise DFS avec la table des parents pour reconstruire le chemin
 * 
 * algo:
 * - DFS avec pile (en LIFO) et visited
 * - init parents[start] = null
 * - a la découverte d'un voisin child (non visité), save setParent(parents, child, current)
 * - stop quand target est decouvert (ou quand la pile est vide)
 * - rebuild avec buildPathFromParents
 */
export const findPathDFS = (
  g: Graph,
  start: NodeId,
  target: NodeId
): NodeId[] | null => {
  
  /**
   * save les parents pour une list de voisins
   * @param children - list des voisins a save
   * @param parentNode - le noeud parent
   * @param pm - table des parents actuelle
   */
  const registerParents = (
    children: NodeId[],
    parentNode: NodeId,
    pm: ParentMap
  ): ParentMap => {
    return isEmpty(children)
      ? pm
      : registerParents(
          tail(children),
          parentNode,
          setParent(pm, head(children), parentNode)
        );
  };
  
  /**
   * Function récursive interne
   * @param frontier - pile des noeuds a explorer (LIFO)
   * @param visited - ensemble des noeuds deja visités
   * @param parents - table des parents
   */
  const go = (
    frontier: NodeId[],
    visited: VisitSet,
    parents: ParentMap
  ): ParentMap | null => {
    // stop case: pile vide => target non trouvé
    return isEmpty(frontier)
      ? null
      : (() => {
          const n = head(frontier);
          const rest = tail(frontier);
          
          // si on a trouvé target, return les parents
          return n === target
            ? parents
            // si deja visité, on ignore et continue
            : hasVisited(visited, n)
              ? go(rest, visited, parents)
              // sinon marquer en mode visité, save les parents des voisins et empiler voisins
              : (() => {
                  const neighborIds = extractNodeIds(neighbors(g, n));
                  const newParents = registerParents(neighborIds, n, parents);
                  return go(
                    concat(neighborIds, rest),
                    markVisited(visited, n),
                    newParents
                  );
                })();
        })();
  };
  
  // cas spécial : start === target
  return start === target
    ? [start]
    : (() => {
        const result = go([start], {}, { [start]: null });
        return result === null
          ? null
          : buildPathFromParents(result, start, target);
      })();
};
