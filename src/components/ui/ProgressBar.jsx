const BAR_COLORS = {
  primary: 'bg-ember',
  secondary: 'bg-info',
  tertiary: 'bg-warn',
};

export function ProgressBar({ value, max = 100, size = 'sm', color = 'primary', className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const track = size === 'md' ? 'progress-track-lg' : 'progress-track';
  const bar = BAR_COLORS[color] ?? BAR_COLORS.primary;

  return (
    <div className={`${track} ${className}`.trim()}>
      <div
        className={`h-full rounded-full ${bar}`}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
