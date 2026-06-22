import type { Algorithm } from '../algorithms/types';

interface ControlsProps {
  algorithm: Algorithm;
  onAlgorithmChange: (a: Algorithm) => void;
  onVisualize: () => void;
  onClear: () => void;
  onClearWalls: () => void;
  onGenerateMaze: () => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (s: number) => void;
}

const ALGORITHMS: Algorithm[] = ['BFS', 'DFS', 'Dijkstra', 'AStar'];

const ALGORITHM_DESCRIPTIONS: Record<Algorithm, string> = {
  BFS: 'Guarantees shortest path · Explores all neighbors layer by layer',
  DFS: 'No shortest path guarantee · Explores deep before backtracking',
  Dijkstra: 'Shortest path with weights · Like BFS on uniform-weight grids',
  AStar: 'Fastest with heuristic · Uses Manhattan distance to guide search',
};

const Controls: React.FC<ControlsProps> = ({
  algorithm, onAlgorithmChange, onVisualize, onClear, onClearWalls,
  onGenerateMaze, isRunning, speed, onSpeedChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 260 }}>
      <h2 style={{ margin: 0, color: '#cdd6f4', fontSize: 20 }}>Maze Solver</h2>

      <div>
        <label style={{ color: '#a6adc8', fontSize: 12, display: 'block', marginBottom: 6 }}>ALGORITHM</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ALGORITHMS.map(a => (
            <button
              key={a}
              onClick={() => onAlgorithmChange(a)}
              disabled={isRunning}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '2px solid',
                borderColor: algorithm === a ? '#89b4fa' : '#45475a',
                backgroundColor: algorithm === a ? '#1e3a5f' : '#181825',
                color: algorithm === a ? '#89b4fa' : '#a6adc8',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: algorithm === a ? 700 : 400,
              }}
            >
              {a === 'AStar' ? 'A*' : a}
            </button>
          ))}
        </div>
        <p style={{ color: '#6c7086', fontSize: 11, marginTop: 8 }}>{ALGORITHM_DESCRIPTIONS[algorithm]}</p>
      </div>

      <div>
        <label style={{ color: '#a6adc8', fontSize: 12, display: 'block', marginBottom: 6 }}>
          SPEED: {speed === 1 ? 'Fast' : speed === 30 ? 'Slow' : 'Medium'}
        </label>
        <input
          type="range" min={1} max={30} value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          disabled={isRunning}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={onVisualize} disabled={isRunning} style={primaryBtn}>
          {isRunning ? 'Running...' : 'Visualize'}
        </button>
        <button onClick={onGenerateMaze} disabled={isRunning} style={secondaryBtn}>
          Generate Maze
        </button>
        <button onClick={onClearWalls} disabled={isRunning} style={secondaryBtn}>
          Clear Walls
        </button>
        <button onClick={onClear} disabled={isRunning} style={secondaryBtn}>
          Reset Grid
        </button>
      </div>

      <div style={{ color: '#6c7086', fontSize: 11, lineHeight: 1.6 }}>
        <strong style={{ color: '#a6adc8' }}>How to use:</strong><br />
        Click/drag to draw walls<br />
        <span style={{ color: '#a6e3a1' }}>■</span> Green = Start &nbsp;
        <span style={{ color: '#f38ba8' }}>■</span> Red = End<br />
        <span style={{ color: '#89b4fa' }}>■</span> Blue = Visited &nbsp;
        <span style={{ color: '#f9e2af' }}>■</span> Yellow = Path
      </div>
    </div>
  );
};

const primaryBtn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 6,
  border: 'none',
  backgroundColor: '#89b4fa',
  color: '#1e1e2e',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 14,
};

const secondaryBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid #45475a',
  backgroundColor: '#181825',
  color: '#cdd6f4',
  cursor: 'pointer',
  fontSize: 13,
};

export default Controls;