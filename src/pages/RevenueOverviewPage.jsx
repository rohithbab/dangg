import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeader } from '../components/layout/SectionHeader';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { RevenueMetricCard } from '../components/ui/RevenueMetricCard';
import { PendingPayoutsCard } from '../components/ui/PendingPayoutsCard';
import { WalletBalanceCard } from '../components/ui/WalletBalanceCard';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';

const WALLET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCbDPnqXOBJu0g_ai2K8T3AOwI5LDYpaRuK3-vn1vLIoFbM7n8q2-IFt3K3S0Rt6ni7edruIDoB26UmvnQIBoyIwhjtAC7sZPkbomTrjnpU4W-N_zWim_ciZeGKThlZ3DWng4YnVQrx9g8dHZH2tDh2xdmUFFK2fMLsqQY5kwqb2fmlDQh8hDMiQI_gN0m0bOq55g6wlPv26V5SOiVfmgUSDFAuIHxEloUVUbNylnnhDYKHvgM7Bf1COkoK4qbgXcKNkSIy75OlDi4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCxcYefdLGiHXlcV5rxGBNNU5WBctcSYpXuTQ4RWrqLtQEhlLX7vW3d89bnRy98oOwKLCEpY3Ipeu8pEl2ADxfCvc6ifLl7m89XE7KyiklFtw016ycogc9hdMFZEeLwSBTjRMeVdpuX0Je1nWBrDdsfX496nBxBO5WRqFD6UBQVApPJ-fbpgkUjYBy---6WM_qx9tsGXPwl7OOwaazTIf5slNshG2oViwZmEwxkbHdUP0U-5dEVgQdS6utRGeoRXMCVmI-Gm5tizI',
];

const REVENUE_METRICS = [
  {
    label: 'Total Revenue',
    value: 2500000,
    icon: 'monetization_on',
    accent: 'primary',
    badge: (
      <span className="badge-trend-up flex items-center gap-1">
        <MaterialIcon name="trending_up" size="sm" />
        +12.5%
      </span>
    ),
  },
  {
    label: 'Completed Payouts',
    value: 1500000,
    icon: 'account_balance',
    accent: 'secondary',
    badge: <span className="badge-neutral">Verified</span>,
  },
  {
    label: 'Actual Profit',
    value: 1000000,
    icon: 'insights',
    accent: 'tertiary',
    badge: <span className="badge-accent">Net 40%</span>,
  },
];

export function RevenueOverviewPage() {
  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <section>
          <SectionHeader title="Revenue Insights" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {REVENUE_METRICS.map((metric, i) => (
              <AnimatedCardEntrance key={metric.label} delay={i * 0.1}>
                <RevenueMetricCard {...metric} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <AnimatedCardEntrance delay={0.4}>
            <WalletBalanceCard
              amount={420000}
              avatarUrls={WALLET_AVATARS}
              avatarCount={12}
            />
          </AnimatedCardEntrance>
          <AnimatedCardEntrance delay={0.6}>
            <PendingPayoutsCard />
          </AnimatedCardEntrance>
        </div>
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
