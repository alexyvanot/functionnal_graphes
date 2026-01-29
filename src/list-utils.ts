// Q1 - Outils fonctionnels sur les listes
// Contraintes : pas de boucles, pas de map/filter/reduce, pas de mutation, pas de if/else

/**
 * check si une liste est vide
 */
export const isEmpty = <T>(xs: T[]): boolean => {
  return xs.length === 0;
};

/**
 * return le premier elementt d'une list
 * si list pas vide
 */
export const head = <T>(xs: T[]): T => {
  return xs[0];
};

/**
 * return la liste sans son premier element
 * si liste pas vide
 */
export const tail = <T>(xs: T[]): T[] => {
  return xs.slice(1);
};

/**
 * add elem au début de list (return new list)
 */
export const prepend = <T>(x: T, xs: T[]): T[] => {
  return [x, ...xs];
};

/**
 * add elem a la fin de list (return new list)
 */
export const append = <T>(xs: T[], x: T): T[] => {
  return [...xs, x];
};

/**
 * concat deux listes de manière récursive
 * ( concat(a, b) = a ++ b )
 * 
 * algo:
 * - si a est vide return b
 * - sinon return prepend(head(a), concat(tail(a), b))
 */
export const concat = <T>(a: T[], b: T[]): T[] => {
  return isEmpty(a)
    ? b
    : prepend(head(a), concat(tail(a), b));
};
