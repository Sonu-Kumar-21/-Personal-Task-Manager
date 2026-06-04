import { CheckCircle2, CircleDashed } from 'lucide-react';

export default function Header({ activeCount, completedCount }) {
  const total = activeCount + completedCount;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <header className="app-header">
      <h1 className="app-title">Task Manager</h1>
      <div className="task-stats">
        <div className="stat-badge">
          <CircleDashed size={16} color="var(--accent-primary)" />
          <span>Active:</span>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-badge">
          <CheckCircle2 size={16} color="var(--success)" />
          <span>Completed:</span>
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>
      <div className="progress-container glass">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </header>
  );
}
