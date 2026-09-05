import { MaterialIcon } from './MaterialIcon';

export function TablePagination({
  summary = 'Showing 1 to 5 of 45 results',
  currentPage = 1,
  pages = [1, 2, 3],
}) {
  return (
    <>
      <p className="font-label-sm text-label-sm normal-case tracking-normal text-ink-2">
        {summary}
      </p>
      <div className="flex gap-2">
        <button type="button" className="pagination-btn" disabled aria-label="Previous page">
          <MaterialIcon name="chevron_left" />
        </button>
        {pages.map((page) =>
          page === currentPage ? (
            <button key={page} type="button" className="pagination-btn-active" aria-current="page">
              {page}
            </button>
          ) : (
            <button key={page} type="button" className="pagination-btn-ghost">
              {page}
            </button>
          ),
        )}
        <button type="button" className="pagination-btn" aria-label="Next page">
          <MaterialIcon name="chevron_right" />
        </button>
      </div>
    </>
  );
}
