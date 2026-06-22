import type { Cell } from './types';

export function key(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

export function getNeighbors(cell: Cell, grid: string[][], rows: number, cols: number): Cell[] {
  const { row, col } = cell;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const neighbors: Cell[] = [];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] !== 'wall') {
      neighbors.push({ row: r, col: c });
    }
  }
  return neighbors;
}

export function reconstructPath(
  cameFrom: Map<string, Cell | null>,
  start: Cell,
  end: Cell
): Cell[] {
  const path: Cell[] = [];
  let current: Cell | null = end;
  const startKey = key(start);

  while (current) {
    path.unshift(current);
    const k = key(current);
    if (k === startKey) break;
    current = cameFrom.get(k) ?? null;
  }

  return path;
}