import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { FemaleProfileHeader } from '../components/ui/FemaleProfileHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EarningsStatCard } from '../components/ui/EarningsStatCard';
import { RatingStatCard } from '../components/ui/RatingStatCard';
import { ChatMetricCard } from '../components/ui/ChatMetricCard';
import { AccountInfoPanel } from '../components/ui/AccountInfoPanel';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { getUserById } from '../data/userProfiles';
import { formatCurrency } from '../utils/formatters';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';

export function FemaleUserProfilePage() {
  const { userId } = useParams();
  const user = getUserById(userId);

  if (!user || user.gender !== 'female') {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="account-info-panel rounded-xl p-8 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="type-headline-lg text-on-surface">User Profile Not Found</h3>
          <p className="type-body-md text-on-surface-variant">
            The female user profile you are trying to view does not exist or has been removed.
          </p>
          <Link to="/users" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-on-primary" />
            Back to User Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const accountRows = [
    { label: 'Phone', value: user.phone },
    { label: 'Age', value: `${user.age} Years` },
    { label: 'Joined At', value: user.joinDate },
    { label: 'Last Active', value: user.lastActive, subLabel: 'Online Now' },
  ];

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <AnimatedCardEntrance delay={0}>
          <FemaleProfileHeader
            avatarUrl={user.avatarUrl}
            avatarAlt={`${user.name} profile`}
            name={user.name}
            age={user.age}
            userId={user.id}
            userStatus={user.onlineStatus || 'active'}
          />
        </AnimatedCardEntrance>

        <section>
          <SectionHeading icon="account_balance" title="Earnings Overview" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {user.earnings.map((item, i) => (
              <AnimatedCardEntrance key={item.label} delay={0.1 + i * 0.05}>
                <EarningsStatCard {...item} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {user.ratings.map((item, i) => (
                <AnimatedCardEntrance key={item.label} delay={0.3 + i * 0.05}>
                  <RatingStatCard {...item} />
                </AnimatedCardEntrance>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AnimatedCardEntrance delay={0.5}>
                <ChatMetricCard icon="forum" label="Total Chats Received" value={user.chatMetrics.totalChats} accent="primary" />
              </AnimatedCardEntrance>
              <AnimatedCardEntrance delay={0.6}>
                <ChatMetricCard
                  icon="schedule"
                  label="Total Duration"
                  value={user.chatMetrics.duration}
                  accent="secondary"
                />
              </AnimatedCardEntrance>
            </div>
          </div>

          <div className="lg:col-span-4">
            <AnimatedCardEntrance delay={0.7}>
              <AccountInfoPanel rows={accountRows} />
            </AnimatedCardEntrance>
          </div>
        </div>

        {user.transactions && (
          <AnimatedCardEntrance delay={0.8}>
            <section className="table-shell">
              <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
                <h4 className="type-headline-md text-on-surface">Transaction Summary</h4>
                <button type="button" className="btn-link">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low">
                    <tr className="table-head">
                      {['Transaction ID', 'Item', 'Amount', 'Date', 'Status'].map((col) => (
                        <th key={col} className="px-6 py-3 uppercase">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {user.transactions.map((row) => (
                      <tr key={row.id} className="table-row">
                        <td className="table-cell-mono px-6 py-4 text-on-surface-variant">#{row.id}</td>
                        <td className="type-body-md px-6 py-4 normal-case text-on-surface">{row.item}</td>
                        <td className="type-body-md px-6 py-4 font-semibold normal-case text-on-surface">
                          {typeof row.amount === 'number' ? formatCurrency(row.amount) : row.amount}
                        </td>
                        <td className="type-body-md px-6 py-4 normal-case text-on-surface-variant">{row.date}</td>
                        <td className="px-6 py-4">
                          <span className="badge-status-stable">{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </AnimatedCardEntrance>
        )}
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
