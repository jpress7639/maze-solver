import type { Cell, AlgorithmResult } from './types';
import { getNeighbors, reconstructPath, key } from './helpers';

function heuristic(a: Cell, b: Cell): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function astar(grid: string[][], start: Cell, end: Cell, rows: number, cols: number): AlgorithmResult {
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, Cell | null>();
  const visitedOrder: Cell[] = [];
  const openSet: Cell[] = [start];

  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, end));
  cameFrom.set(key(start), null);

  while (openSet.length > 0) {
    openSet.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
    const current = openSet.shift()!;
    const ck = key(current);
    visitedOrder.push(current);

    if (ck === key(end)) {
      const path = reconstructPath(cameFrom, start, end);
      return { visitedOrder, path, nodesVisited: visitedOrder.length, pathLength: path.length };
    }

    for (const neighbor of getNeighbors(current, grid, rows, cols)) {
      const nk = key(neighbor);
      const tentativeG = (gScore.get(ck) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, current);
        gScore.set(nk, tentativeG);
        fScore.set(nk, tentativeG + heuristic(neighbor, end));
        if (!openSet.some(c => key(c) === nk)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedOrder, path: [], nodesVisited: visitedOrder.length, pathLength: 0 };
}