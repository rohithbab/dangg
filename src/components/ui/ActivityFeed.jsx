import { MaterialIcon } from './MaterialIcon';
import { formatCurrency } from '../../utils/formatters';

export function ActivityFeed({ title = 'Live Revenue Feed', items = [] }) {
  return (
    <section className="activity-panel">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-on-surface" />
        <h5 className="text-sm font-bold text-on-surface">{title}</h5>
      </div>
      <div className="space-y-4">
        {items.map((item) => {
          const isNumeric = typeof item.amount === 'number';
          const formattedAmount = isNumeric 
            ? (item.amount > 0 ? '+' : '') + formatCurrency(item.amount)
            : item.amount;
          
          return (
            <div key={item.id} className="activity-item">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container">
                  <MaterialIcon name={item.icon} className={item.iconColor ?? 'text-primary'} />
                </div>
                <div>
                  <p className="type-body-md text-on-surface">{item.title}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{item.meta}</p>
                </div>
              </div>
              <p className={`type-headline-md ${item.amountColor ?? 'text-on-surface'}`}>
                {formattedAmount}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
