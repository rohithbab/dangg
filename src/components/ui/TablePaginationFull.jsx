import { MaterialIcon } from './MaterialIcon';

export function TablePaginationFull({
  summary = 'Showing 1-5 of 850 users',
  currentPage = 1,
  pages = [1, 2, 3],
}) {
  return (
    <>
      <p className="font-label-sm text-label-sm normal-case tracking-normal text-ink-2">
        {summary}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className="pagination-btn-sm" disabled aria-label="First page">
          <MaterialIcon name="first_page" size="sm" />
        </button>
        <button type="button" className="pagination-btn-sm" disabled aria-label="Previous page">
          <MaterialIcon name="navigate_before" size="sm" />
        </button>
        {pages.map((page) =>
          page === currentPage ? (
            <span key={page} className="pagination-page-active" aria-current="page">
              {page}
            </span>
          ) : (
            <span key={page} className="pagination-page">
              {page}
            </span>
          ),
        )}
        <button type="button" className="pagination-btn-sm" aria-label="Next page">
          <MaterialIcon name="navigate_next" size="sm" />
        </button>
        <button type="button" className="pagination-btn-sm" aria-label="Last page">
          <MaterialIcon name="last_page" size="sm" />
        </button>
      </div>
    </>
  );
}
