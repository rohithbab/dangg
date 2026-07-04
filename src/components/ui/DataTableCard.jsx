import { MaterialIcon } from './MaterialIcon';
import { StatusBadge } from './StatusBadge';

export function DataTableCard({ title, badge, columns, rows }) {
  return (
    <article className="table-shell">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
        <h3 className="text-sm font-bold text-on-surface">{title}</h3>
        {badge && (
          <div className="flex gap-2">
            <StatusBadge variant="health" icon={<MaterialIcon name="check_circle" fill size="sm" />}>
              {badge}
            </StatusBadge>
          </div>
        )}
      </div>
      <div className="overflow-x-auto p-0">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="table-head">
              {columns.map((col) => (
                <th key={col} className="border-b border-outline-variant px-6 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="type-body-md divide-y divide-outline-variant">
            {rows.map((row) => (
              <tr key={row.id ?? row.region} className="table-row">
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-6 py-4 ${i === 0 ? 'font-bold' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
