import type { Cell, AlgorithmResult } from './types';
import { getNeighbors, reconstructPath, key } from './helpers';

export function bfs(grid: string[][], start: Cell, end: Cell, rows: number, cols: number): AlgorithmResult {
  const queue: Cell[] = [start];
  const visited = new Set<string>([key(start)]);
  const cameFrom = new Map<string, Cell | null>([[key(start), null]]);
  const visitedOrder: Cell[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
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
        queue.push(neighbor);
      }
    }
  }

  return { visitedOrder, path: [], nodesVisited: visitedOrder.length, pathLength: 0 };
}