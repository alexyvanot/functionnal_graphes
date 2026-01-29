// Tests de validation des contraintes de programmation fonctionnelle
// Vérifie que le code respecte: pas de boucles, pas de map/filter/reduce, pas de mutation, pas de if/else

import * as listUtils from '../src/list-utils';
import * as visited from '../src/visited';
import * as dfs from '../src/dfs';
import * as parent from '../src/parent';
import * as bfs from '../src/bfs';

// Patterns interdits
const FORBIDDEN_PATTERNS = {
  loops: /\b(for|while|do)\s*\(/,
  forEach: /\.forEach\s*\(/,
  mapFilterReduce: /\.(map|filter|reduce|reduceRight)\s*\(/,
  mutations: /\.(push|pop|shift|unshift|splice|reverse|sort|fill)\s*\(/,
  ifElse: /\bif\s*\(|\belse\b/,
};

// Fonction helper pour check le code source d'une function
const checkFunctionConstraints = (fn: Function, fnName: string) => {
  const source = fn.toString();
  
  return {
    hasLoops: FORBIDDEN_PATTERNS.loops.test(source),
    hasForEach: FORBIDDEN_PATTERNS.forEach.test(source),
    hasMapFilterReduce: FORBIDDEN_PATTERNS.mapFilterReduce.test(source),
    hasMutations: FORBIDDEN_PATTERNS.mutations.test(source),
    hasIfElse: FORBIDDEN_PATTERNS.ifElse.test(source),
    source,
    fnName,
  };
};

// check toutes les contraintes pour une fonction
const assertNoForbiddenPatterns = (fn: Function, fnName: string) => {
  const check = checkFunctionConstraints(fn, fnName);
  
  expect({ fn: fnName, violation: 'loops (for/while/do)', found: check.hasLoops })
    .toEqual({ fn: fnName, violation: 'loops (for/while/do)', found: false });
  
  expect({ fn: fnName, violation: 'forEach', found: check.hasForEach })
    .toEqual({ fn: fnName, violation: 'forEach', found: false });
  
  expect({ fn: fnName, violation: 'map/filter/reduce', found: check.hasMapFilterReduce })
    .toEqual({ fn: fnName, violation: 'map/filter/reduce', found: false });
  
  expect({ fn: fnName, violation: 'mutations (push/pop/etc)', found: check.hasMutations })
    .toEqual({ fn: fnName, violation: 'mutations (push/pop/etc)', found: false });
  
  expect({ fn: fnName, violation: 'if/else', found: check.hasIfElse })
    .toEqual({ fn: fnName, violation: 'if/else', found: false });
};

describe('Validation des contraintes - Q1 (list-utils)', () => {
  
  test('isEmpty ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.isEmpty, 'isEmpty');
  });

  test('head ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.head, 'head');
  });

  test('tail ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.tail, 'tail');
  });

  test('prepend ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.prepend, 'prepend');
  });

  test('append ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.append, 'append');
  });

  test('concat ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(listUtils.concat, 'concat');
  });

});

describe('Validation des contraintes - Q2 (visited)', () => {
  
  test('hasVisited ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(visited.hasVisited, 'hasVisited');
  });

  test('markVisited ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(visited.markVisited, 'markVisited');
  });

});

describe('Validation des contraintes - Q3 (dfs)', () => {
  
  test('reachableDFS ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(dfs.reachableDFS, 'reachableDFS');
  });

});

describe('Validation des contraintes - Q4 (parent)', () => {
  
  test('hasParent ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(parent.hasParent, 'hasParent');
  });

  test('setParent ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(parent.setParent, 'setParent');
  });

  test('buildPathFromParents ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(parent.buildPathFromParents, 'buildPathFromParents');
  });

});

describe('Validation des contraintes - Q5 (findPathDFS)', () => {
  
  test('findPathDFS ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(dfs.findPathDFS, 'findPathDFS');
  });

});

describe('Validation des contraintes - Q6 (shortestPathBFS)', () => {
  
  test('shortestPathBFS ne contient pas de patterns interdits', () => {
    assertNoForbiddenPatterns(bfs.shortestPathBFS, 'shortestPathBFS');
  });

});
