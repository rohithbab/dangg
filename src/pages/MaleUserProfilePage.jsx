import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { UserProfileHeader } from '../components/ui/UserProfileHeader';
import { ProfileStatCard } from '../components/ui/ProfileStatCard';
import { ChatEngagementCard } from '../components/ui/ChatEngagementCard';
import { AccountInfoCard } from '../components/ui/AccountInfoCard';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { getUserById } from '../data/userProfiles';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';

export function MaleUserProfilePage() {
  const { userId } = useParams();
  const user = getUserById(userId);

  if (!user || user.gender !== 'male') {
    return (
      <PageContainer className="shell-content--narrow flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bento-card rounded-xl p-8 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="type-headline-lg text-on-surface">User Profile Not Found</h3>
          <p className="type-body-md text-on-surface-variant">
            The male user profile you are trying to view does not exist or has been removed.
          </p>
          <Link to="/users" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-on-primary" />
            Back to User Directory
          </Link>
        </div>
      </PageContainer>
    );
  }

  const financialStats = user.financialStats.map((stat) => ({
    ...stat,
    trend: stat.trend ? (
      <>
        {stat.trend} <MaterialIcon name="trending_up" size="sm" />
      </>
    ) : undefined,
  }));

  const accountInfo = [
    { icon: 'call', label: 'Phone Number', value: user.phone },
    { icon: 'calendar_today', label: 'Joined At', value: user.joinDate },
    { icon: 'history', label: 'Last Active', value: user.lastActive },
  ];

  return (
    <PageContainer className="shell-content--narrow">
      <AnimatedStaggerGroup className="space-y-10">
        <AnimatedCardEntrance delay={0}>
          <UserProfileHeader
            avatarUrl={user.avatarUrl}
            avatarAlt={`${user.name} profile`}
            username={user.name}
            gender={user.gender}
            age={user.age}
            userId={user.id}
          />
        </AnimatedCardEntrance>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-2">
            {financialStats.map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={0.2 + i * 0.1}>
                <ProfileStatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>

          <div className="space-y-8">
            <AnimatedCardEntrance delay={0.5}>
              <ChatEngagementCard metrics={user.chatMetrics} />
            </AnimatedCardEntrance>
            <AnimatedCardEntrance delay={0.6}>
              <AccountInfoCard items={accountInfo} />
            </AnimatedCardEntrance>
          </div>
        </div>

        <AnimatedCardEntrance delay={0.7}>
          <section className="table-shell">
            <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
              <h4 className="type-headline-md text-on-surface">Recent Transaction History</h4>
              <button type="button" className="btn-link">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr className="table-head">
                    {['Transaction ID', 'Item', 'Amount', 'Date', 'Status'].map((col) => (
                      <th key={col} className="px-6 py-3 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {user.transactions.map((row) => (
                    <tr key={row.id} className="table-row">
                      <td className="table-cell-mono px-6 py-4">#{row.id}</td>
                      <td className="type-body-md px-6 py-4 normal-case text-on-surface">{row.item}</td>
                      <td className="type-body-md px-6 py-4 font-semibold normal-case text-on-surface">
                        {row.amount}
                      </td>
                      <td className="type-body-md px-6 py-4 normal-case text-on-surface-variant">
                        {row.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-transaction-success">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </AnimatedCardEntrance>
      </AnimatedStaggerGroup>
    </PageContainer>
  );
}
