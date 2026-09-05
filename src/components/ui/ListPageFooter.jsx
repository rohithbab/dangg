export function ListPageFooter({
  summary,
  previousLabel = 'Previous',
  nextLabel = 'Next Page',
  previousDisabled = true,
  onPrevious,
  onNext,
}) {
  return (
    <div className="list-page-footer">
      <span className="type-label-md normal-case tracking-normal text-ink-2">
        {summary}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-pagination-secondary"
          disabled={previousDisabled}
          onClick={onPrevious}
        >
          {previousLabel}
        </button>
        <button type="button" className="btn-pagination-primary" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
