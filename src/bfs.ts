// Q6 - Plus court chemin par BFS (Breadth-First Search)
// parcours du graph en largeur pour trouver le chemin minimal (en nombre d'aretes)

import { Graph, NodeId, neighbors } from './types';
import { VisitSet, hasVisited, markVisited } from './visited';
import { isEmpty, head, tail, concat, append } from './list-utils';
import { ParentMap, hasParent, setParent, buildPathFromParents } from './parent';

/**
 * extract les NodeId des voisins (arêtes) d'un node
 * utilise la récursion pour transformer Edge[] en NodeId[]
 */
const extractNodeIds = (edges: { to: NodeId }[]): NodeId[] => {
  return isEmpty(edges)
    ? []
    : [head(edges).to, ...extractNodeIds(tail(edges))];
};

/**
 * Q6 - Trouve le plus court chemin (en nombre d'aretes) de start a target
 * Utilise BFS avec file (FIFO) pour garantir la minimal state
 * 
 * algo:
 * - BFS avec file (FIFO) et visited
 * - Initialiser parents[start] = null
 * - a la decouvert d'un voisin child, save son parent mais juste UNE SEULE FOIS
 * - Enfiler les voisins mais que EN FIN de file (FIFO) pour assurer minimal state
 * - rebuild avec buildPathFromParents
 */
export const shortestPathBFS = (
  g: Graph,
  start: NodeId,
  target: NodeId
): NodeId[] | null => {
  
  /**
   * Filter les voisins non encore decouvert (pas dans parents)
   * et les enregistre dans la table des parents
   */
  const processNeighbors = (
    children: NodeId[],
    parentNode: NodeId,
    pm: ParentMap
  ): { newChildren: NodeId[], newParents: ParentMap } => {
    return isEmpty(children)
      ? { newChildren: [], newParents: pm }
      : (() => {
          const child = head(children);
          const rest = tail(children);
          const restResult = processNeighbors(rest, parentNode, pm);
          
          // si child a pas encore de parent, on l'ajoute
          return hasParent(pm, child)
            ? restResult
            : {
                newChildren: [child, ...restResult.newChildren],
                newParents: setParent(restResult.newParents, child, parentNode)
              };
        })();
  };
  
  /**
   * Function récursive BFS
   * @param queue - file des noeuds a explorer (FIFO)
   * @param visited - ensemble des noeuds déja visités
   * @param parents - table des parents
   */
  const go = (
    queue: NodeId[],
    visited: VisitSet,
    parents: ParentMap
  ): ParentMap | null => {
    // stop case : file vide => target non trouvé
    return isEmpty(queue)
      ? null
      : (() => {
          const n = head(queue);
          const rest = tail(queue);
          
          // si on a trouvé la cible, retourner les parents
          return n === target
            ? parents
            // sinon, marquer visité, save parents des voisins, enfiler voisins à LA FIN
            : (() => {
                const neighborIds = extractNodeIds(neighbors(g, n));
                const { newChildren, newParents } = processNeighbors(neighborIds, n, parents);
                // BFS: enfiler a la fin (FIFO) avec concat(rest, newChildren)
                return go(
                  concat(rest, newChildren),
                  markVisited(visited, n),
                  newParents
                );
              })();
        })();
  };
  
  // special cas: start === target
  return start === target
    ? [start]
    : (() => {
        const result = go([start], {}, { [start]: null });
        return result === null
          ? null
          : buildPathFromParents(result, start, target);
      })();
};
