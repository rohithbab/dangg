import { MaterialIcon } from './MaterialIcon';

export function AccountInfoPanel({ title = 'Account Info', rows, onEdit }) {
  return (
    <article className="account-info-panel">
      <h3 className="type-headline-md mb-6 flex items-center gap-2 text-ink">
        <MaterialIcon name="info" className="text-ink-2" />
        {title}
      </h3>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.label} className={row.subLabel ? '' : 'account-info-row'}>
            {row.subLabel ? (
              <div className="account-info-row">
                <span className="type-body-md normal-case text-ink-2">{row.label}</span>
                <div className="text-right">
                  <span className="type-body-md font-semibold normal-case text-ink">
                    {row.value}
                  </span>
                  <p className="status-online-label">{row.subLabel}</p>
                </div>
              </div>
            ) : (
              <>
                <span className="type-body-md normal-case text-ink-2">{row.label}</span>
                <span className="type-body-md font-semibold normal-case text-ink">{row.value}</span>
              </>
            )}
          </div>
        ))}
        {onEdit !== false && (
          <div className="pt-4">
            <button type="button" className="btn-edit-profile" onClick={onEdit}>
              <MaterialIcon name="edit" size="sm" />
              EDIT PROFILE DETAILS
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
