import type { Algorithm, AlgorithmResult } from '../algorithms/types';

interface StatsPanelProps {
  result: AlgorithmResult | null;
  algorithm: Algorithm;
  timeTaken: number | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ result, algorithm, timeTaken }) => {
  if (!result) return null;

  return (
    <div style={{
      display: 'flex', gap: 24, padding: '12px 20px',
      backgroundColor: '#181825', borderRadius: 8,
      border: '1px solid #45475a', marginTop: 16,
    }}>
      <Stat label="Algorithm" value={algorithm === 'AStar' ? 'A*' : algorithm} />
      <Stat label="Nodes Visited" value={result.nodesVisited.toString()} />
      <Stat label="Path Length" value={result.pathLength > 0 ? result.pathLength.toString() : 'No path'} />
      {timeTaken !== null && <Stat label="Time" value={`${timeTaken}ms`} />}
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ color: '#6c7086', fontSize: 11 }}>{label}</div>
    <div style={{ color: '#cdd6f4', fontSize: 18, fontWeight: 700 }}>{value}</div>
  </div>
);

export default StatsPanel;