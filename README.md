# Functional Programming - Graph Exploration

A TypeScript project made for my studies, exploring graph traversals (DFS/BFS) in a **strictly functional** style.

## Constraints

- ❌ No loops (`for`, `while`, `forEach`)
- ❌ No `map` / `filter` / `reduce`
- ❌ No mutations (`push`, `pop`, etc.)
- ❌ No `if` / `else` (ternary only)
- ✅ Recursion only
- ✅ Pure functions

## Getting Started

```bash
# Install
npm install

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run ui
```

## Structure

| Question | File | Description |
|----------|------|-------------|
| Q1 | `src/list-utils.ts` | Functional list utilities |
| Q2 | `src/visited.ts` | Visited nodes management (cycles) |
| Q3 | `src/dfs.ts` | DFS reachability |
| Q4 | `src/parent.ts` | Parent map + path reconstruction |
| Q5 | `src/dfs.ts` | Find a path with DFS |
| Q6 | `src/bfs.ts` | Shortest path with BFS |

## Tests

Tests verify both correctness **AND** functional constraints compliance (no loops, no if/else, etc.).

```bash
npm test
```
