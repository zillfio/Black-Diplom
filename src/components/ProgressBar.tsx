import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  size = 'md',
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`progress-bar progress-bar--${size} ${className}`}>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="progress-bar__label">{clamped}%</span>
      )}
    </div>
  );
}
