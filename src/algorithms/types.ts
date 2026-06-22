export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export interface Cell {
  row: number;
  col: number;
}

export interface AlgorithmResult {
  visitedOrder: Cell[];
  path: Cell[];
  nodesVisited: number;
  pathLength: number;
}

export type Algorithm = 'BFS' | 'DFS' | 'Dijkstra' | 'AStar';