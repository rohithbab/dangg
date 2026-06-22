import { motion } from 'framer-motion';
import { MaterialIcon } from './MaterialIcon';
import { AnimatedCounter } from '../animation';
import { formatCurrency } from '../../utils/formatters';

export function WalletBalanceCard({
  title = 'Female Wallet Balance',
  label = 'Reserved Capital',
  amount = 4200,
  avatarCount = 8,
  avatarUrls = [],
  status = 'Active',
}) {
  const visibleAvatars = avatarUrls.slice(0, 2);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card-wallet lg:col-span-7 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/6 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-8 h-32 w-32 rounded-full bg-primary/4 blur-xl" />

      <div className="relative z-10 w-full p-8">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <MaterialIcon name="female" className="text-on-sidebar-muted" size="sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-sidebar-muted">
                {label}
              </span>
            </div>
            <h5 className="text-base font-bold text-on-sidebar">{title}</h5>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-surface">
            <MaterialIcon name="account_balance_wallet" className="text-on-sidebar-muted" size="sm" />
          </div>
        </div>

        {/* Amount + status */}
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-on-sidebar-muted/60">
              Available Funds
            </p>
            <h4 className="text-4xl font-black tracking-tight text-on-sidebar leading-none">
              <AnimatedCounter value={amount} formatter={formatCurrency} />
            </h4>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex -space-x-2">
              {visibleAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-sidebar object-cover"
                />
              ))}
              {avatarCount > visibleAvatars.length && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sidebar bg-sidebar-surface text-[10px] font-bold text-on-sidebar-muted">
                  +{avatarCount - visibleAvatars.length}
                </div>
              )}
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {status}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
