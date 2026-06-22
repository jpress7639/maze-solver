import type { CellType } from '../algorithms/types';

interface GridProps {
  grid: CellType[][];
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
}

const CELL_COLORS: Record<CellType, string> = {
  empty: '#1e1e2e',
  wall: '#313244',
  start: '#a6e3a1',
  end: '#f38ba8',
  visited: '#89b4fa',
  path: '#f9e2af',
};

const Grid: React.FC<GridProps> = ({ grid, onCellMouseDown, onCellMouseEnter, onCellMouseUp }) => {
  return (
    <div
      onMouseLeave={onCellMouseUp}
      style={{ display: 'inline-block', userSelect: 'none', border: '2px solid #45475a', borderRadius: 4 }}
    >
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cellType, c) => (
            <div
              key={c}
              onMouseDown={() => onCellMouseDown(r, c)}
              onMouseEnter={() => onCellMouseEnter(r, c)}
              onMouseUp={onCellMouseUp}
              style={{
                width: 22,
                height: 22,
                backgroundColor: CELL_COLORS[cellType],
                border: '1px solid #181825',
                boxSizing: 'border-box',
                cursor: 'pointer',
                transition: 'background-color 0.08s ease',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;