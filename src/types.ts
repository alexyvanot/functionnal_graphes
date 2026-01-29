// Types pour la respresentation du graphe
export type NodeId = string;

export type Edge = {
  to: NodeId;
  cost: number;
};

export type Graph = {
  adj: { [node: string]: Edge[] };
};

export const neighbors = (g: Graph, n: NodeId): Edge[] =>
  g.adj[n] ?? [];
