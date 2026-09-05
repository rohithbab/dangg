const SEGMENT_CLASSES = {
  pending: 'distribution-segment-pending',
  completed: 'distribution-segment-completed',
  rejected: 'distribution-segment-rejected',
  processing: 'distribution-segment-processing',
};

const LEGEND_DOT_CLASSES = {
  pending: 'legend-dot-pending',
  completed: 'legend-dot-completed',
  rejected: 'legend-dot-rejected',
  processing: 'legend-dot-processing',
};

export function DistributionCard({ title, segments }) {
  return (
    <article className="card-base card-pad-lg overflow-hidden">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="type-headline-md truncate text-ink" title={title}>{title}</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-center gap-2">
              <div className={`${LEGEND_DOT_CLASSES[segment.id]} shrink-0`} aria-hidden />
              <span className="font-label-sm whitespace-nowrap text-label-sm normal-case tracking-normal text-ink-2">
                {segment.label} ({segment.percentLabel})
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="distribution-track" role="img" aria-label={`${title} breakdown`}>
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={`${SEGMENT_CLASSES[segment.id]} transition-all duration-1000 ease-out`}
            style={{ width: `${segment.percent}%` }}
          >
            {segment.showLabel ? (
              <span className="truncate px-1" title={segment.percentLabel}>
                {segment.percentLabel}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </article>
  );
}
