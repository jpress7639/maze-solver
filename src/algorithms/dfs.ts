import type { Cell, AlgorithmResult } from './types';
import { getNeighbors, reconstructPath, key } from './helpers';

export function dfs(grid: string[][], start: Cell, end: Cell, rows: number, cols: number): AlgorithmResult {
  const stack: Cell[] = [start];
  const visited = new Set<string>([key(start)]);
  const cameFrom = new Map<string, Cell | null>([[key(start), null]]);
  const visitedOrder: Cell[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;
    visitedOrder.push(current);

    if (key(current) === key(end)) {
      const path = reconstructPath(cameFrom, start, end);
      return { visitedOrder, path, nodesVisited: visitedOrder.length, pathLength: path.length };
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const k = key(neighbor);
      if (!visited.has(k)) {
        visited.add(k);
        cameFrom.set(k, current);
        stack.push(neighbor);
      }
    }
  }

  return { visitedOrder, path: [], nodesVisited: visitedOrder.length, pathLength: 0 };
}