import { useState, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import type { CellType, Algorithm, AlgorithmResult, Cell } from './algorithms/types';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { dijkstra } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';

const ROWS = 25;
const COLS = 50;
const START: Cell = { row: 12, col: 5 };
const END: Cell = { row: 12, col: 44 };

function makeGrid(): CellType[][] {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      if (r === START.row && c === START.col) return 'start';
      if (r === END.row && c === END.col) return 'end';
      return 'empty';
    })
  );
}

function runAlgorithm(algo: Algorithm, grid: CellType[][], start: Cell, end: Cell): AlgorithmResult {
  switch (algo) {
    case 'BFS': return bfs(grid, start, end, ROWS, COLS);
    case 'DFS': return dfs(grid, start, end, ROWS, COLS);
    case 'Dijkstra': return dijkstra(grid, start, end, ROWS, COLS);
    case 'AStar': return astar(grid, start, end, ROWS, COLS);
  }
}

function generateMaze(rows: number, cols: number, start: Cell, end: Cell): CellType[][] {
  const grid: CellType[][] = Array.from({ length: rows }, () =>
    Array(cols).fill('empty') as CellType[]
  );

  function divide(rStart: number, rEnd: number, cStart: number, cEnd: number, horizontal: boolean) {
    if (rEnd - rStart < 2 || cEnd - cStart < 2) return;
    if (horizontal) {
      const wallRow = rStart + 1 + Math.floor(Math.random() * Math.floor((rEnd - rStart) / 2)) * 2 - 1;
      const passCol = cStart + Math.floor(Math.random() * Math.ceil((cEnd - cStart + 1) / 2)) * 2;
      for (let c = cStart; c <= cEnd; c++) {
        if (c !== passCol) grid[wallRow][c] = 'wall';
      }
      divide(rStart, wallRow - 1, cStart, cEnd, !horizontal);
      divide(wallRow + 1, rEnd, cStart, cEnd, !horizontal);
    } else {
      const wallCol = cStart + 1 + Math.floor(Math.random() * Math.floor((cEnd - cStart) / 2)) * 2 - 1;
      const passRow = rStart + Math.floor(Math.random() * Math.ceil((rEnd - rStart + 1) / 2)) * 2;
      for (let r = rStart; r <= rEnd; r++) {
        if (r !== passRow) grid[r][wallCol] = 'wall';
      }
      divide(rStart, rEnd, cStart, wallCol - 1, !horizontal);
      divide(rStart, rEnd, wallCol + 1, cEnd, !horizontal);
    }
  }

  divide(0, rows - 1, 0, cols - 1, cols < rows);
  grid[start.row][start.col] = 'start';
  grid[end.row][end.col] = 'end';
  return grid;
}

export default function App() {
  const [grid, setGrid] = useState<CellType[][]>(makeGrid);
  const [algorithm, setAlgorithm] = useState<Algorithm>('BFS');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [speed, setSpeed] = useState(10);
  const isDrawing = useRef(false);
  const drawMode = useRef<'wall' | 'empty'>('wall');

  const handleCellMouseDown = useCallback((r: number, c: number) => {
    if (isRunning) return;
    setGrid(prev => {
      const cellType = prev[r][c];
      if (cellType === 'start' || cellType === 'end') return prev;
      drawMode.current = cellType === 'wall' ? 'empty' : 'wall';
      isDrawing.current = true;
      const next = prev.map(row => [...row]);
      next[r][c] = drawMode.current;
      return next;
    });
  }, [isRunning]);

  const handleCellMouseEnter = useCallback((r: number, c: number) => {
    if (!isDrawing.current || isRunning) return;
    setGrid(prev => {
      const cellType = prev[r][c];
      if (cellType === 'start' || cellType === 'end') return prev;
      const next = prev.map(row => [...row]);
      next[r][c] = drawMode.current;
      return next;
    });
  }, [isRunning]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleVisualize = useCallback(async () => {
    setIsRunning(true);
    setResult(null);

    const cleanGrid = grid.map(row =>
      row.map(c => (c === 'visited' || c === 'path' ? 'empty' as CellType : c))
    );
    setGrid(cleanGrid);

    const t0 = performance.now();
    const res = runAlgorithm(algorithm, cleanGrid, START, END);
    const elapsed = Math.round(performance.now() - t0);

    for (const { row, col } of res.visitedOrder) {
      await new Promise(r => setTimeout(r, speed));
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (next[row][col] !== 'start' && next[row][col] !== 'end') next[row][col] = 'visited';
        return next;
      });
    }

    for (const { row, col } of res.path) {
      await new Promise(r => setTimeout(r, speed * 2));
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if (next[row][col] !== 'start' && next[row][col] !== 'end') next[row][col] = 'path';
        return next;
      });
    }

    setResult(res);
    setTimeTaken(elapsed);
    setIsRunning(false);
  }, [grid, algorithm, speed]);

  const handleClear = useCallback(() => {
    setGrid(makeGrid());
    setResult(null);
    setTimeTaken(null);
  }, []);

  const handleClearWalls = useCallback(() => {
    setGrid(prev =>
      prev.map(row =>
        row.map(c => (c === 'wall' || c === 'visited' || c === 'path' ? 'empty' : c))
      )
    );
    setResult(null);
  }, []);

  const handleGenerateMaze = useCallback(() => {
    setGrid(generateMaze(ROWS, COLS, START, END));
    setResult(null);
    setTimeTaken(null);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#1e1e2e',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 32, fontFamily: 'monospace',
    }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <Controls
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          onVisualize={handleVisualize}
          onClear={handleClear}
          onClearWalls={handleClearWalls}
          onGenerateMaze={handleGenerateMaze}
          isRunning={isRunning}
          speed={speed}
          onSpeedChange={setSpeed}
        />
        <div>
          <Grid
            grid={grid}
            onCellMouseDown={handleCellMouseDown}
            onCellMouseEnter={handleCellMouseEnter}
            onCellMouseUp={handleMouseUp}
          />
          <StatsPanel result={result} algorithm={algorithm} timeTaken={timeTaken} />
        </div>
      </div>
    </div>
  );
}
