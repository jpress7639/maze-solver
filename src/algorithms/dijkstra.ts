import type { Cell, AlgorithmResult } from './types';
import { getNeighbors, reconstructPath, key } from './helpers';

export function dijkstra(grid: string[][], start: Cell, end: Cell, rows: number, cols: number): AlgorithmResult {
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, Cell | null>();
  const visitedOrder: Cell[] = [];
  const pq: [number, Cell][] = [[0, start]];

  dist.set(key(start), 0);
  cameFrom.set(key(start), null);

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, current] = pq.shift()!;
    const ck = key(current);

    if (d > (dist.get(ck) ?? Infinity)) continue;
    visitedOrder.push(current);

    if (ck === key(end)) {
      const path = reconstructPath(cameFrom, start, end);
      return { visitedOrder, path, nodesVisited: visitedOrder.length, pathLength: path.length };
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const nk = key(neighbor);
      const newDist = d + 1;
      if (newDist < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, newDist);
        cameFrom.set(nk, current);
        pq.push([newDist, neighbor]);
      }
    }
  }

  return { visitedOrder, path: [], nodesVisited: visitedOrder.length, pathLength: 0 };
}