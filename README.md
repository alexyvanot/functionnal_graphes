# Programmation Fonctionnelle - Exploration de Graphes

TP réalisé dans le cadre de mes études en TypeScript, explorant les parcours de graphes (DFS/BFS) en style **strictement fonctionnel**.

## Contraintes respectées

- ❌ Aucune boucle (`for`, `while`, `forEach`)
- ❌ Aucun `map` / `filter` / `reduce`
- ❌ Aucune mutation (`push`, `pop`, etc.)
- ❌ Aucun `if` / `else` (uniquement ternaires)
- ✅ Récursivité uniquement
- ✅ Fonctions pures

## Getting Started

```bash
# Installation
npm install

# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

## Structure

| Question | Fichier | Description |
|----------|---------|-------------|
| Q1 | `src/list-utils.ts` | Utilitaires fonctionnels sur les listes |
| Q2 | `src/visited.ts` | Gestion des noeuds visités (cycles) |
| Q3 | `src/dfs.ts` | Atteignabilité par DFS |
| Q4 | `src/parent.ts` | Table des parents + reconstruction de chemin |
| Q5 | `src/dfs.ts` | Trouver un chemin par DFS |
| Q6 | `src/bfs.ts` | Plus court chemin par BFS |

## Tests

Les tests vérifient à la fois le bon fonctionnement **ET** le respect des contraintes fonctionnelles (pas de boucles, pas de if/else, etc.).

```bash
npm test
```
