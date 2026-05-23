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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="card-wallet lg:col-span-7"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/3 overflow-hidden opacity-10">
        <svg className="h-full w-full fill-current text-white" viewBox="0 0 200 200" aria-hidden>
          <path
            d="M44.7,-76.4C58.3,-69.2,70.1,-58.4,78.8,-45.3C87.4,-32.2,93,-16.1,91.8,-0.7C90.5,14.7,82.4,29.4,72.7,42.3C63.1,55.1,51.8,66,38.6,73.5C25.3,80.9,10.1,84.9,-4.6,82.2C-19.3,79.5,-33.5,70.1,-46.1,60.1C-58.7,50.1,-69.8,39.4,-76.8,26.4C-83.9,13.4,-86.9,-1.9,-83.4,-15.9C-79.9,-29.9,-70,-42.6,-58.3,-50.7C-46.6,-58.8,-33.2,-62.4,-20.5,-70.4C-7.9,-78.4,4.1,-90.7,18.4,-90.1C32.7,-89.5,49.2,-76,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="relative z-10 w-full p-8">
        <div className="mb-12 flex items-start justify-between">
          <div className="text-white">
            <div className="mb-1 flex items-center gap-2">
              <MaterialIcon name="female" className="text-[18px] text-indigo-200" />
              <span className="type-label-md font-bold tracking-widest text-indigo-100">{label}</span>
            </div>
            <h5 className="type-headline-lg text-white">{title}</h5>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
            <MaterialIcon name="account_balance_wallet" className="text-[32px] text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="type-label-sm mb-1 uppercase text-indigo-100 opacity-80">Available Funds</p>
            <h4 className="text-[42px] font-bold leading-tight text-white">
              <AnimatedCounter value={amount} formatter={formatCurrency} />
            </h4>
          </div>
          <div className="flex flex-col items-end">
            <div className="mb-3 flex -space-x-2">
              {visibleAvatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-primary-container object-cover"
                />
              ))}
              {avatarCount > visibleAvatars.length && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-container bg-white/20 text-[10px] font-bold text-white backdrop-blur-sm">
                  +{avatarCount - visibleAvatars.length}
                </div>
              )}
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
              {status}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
