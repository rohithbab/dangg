import { MaterialIcon } from './MaterialIcon';

export function AccountInfoCard({ title = 'Account Information', items }) {
  return (
    <article className="bento-card rounded-xl p-6">
      <h4 className="type-headline-md mb-4 text-ink">{title}</h4>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="account-info-icon-well">
              <MaterialIcon name={item.icon} />
            </div>
            <div>
              <p className="font-label-sm text-label-sm normal-case text-ink-2">
                {item.label}
              </p>
              <p className="type-body-md font-semibold normal-case text-ink">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
