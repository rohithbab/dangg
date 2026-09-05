import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { UserProfileHeader } from '../components/ui/UserProfileHeader';
import { ProfileStatCard } from '../components/ui/ProfileStatCard';
import { ChatEngagementCard } from '../components/ui/ChatEngagementCard';
import { AccountInfoCard } from '../components/ui/AccountInfoCard';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { adminApi } from '../lib/adminApi';
import { formatRupees, formatDate, formatPhone, shortId } from '../lib/utils';

function fetchMaleProfile(userId) {
  return async function fetchMaleProfileQuery() {
    return adminApi('userProfile', { userId, role: 'male' })
  }
}

function PageSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-10 animate-pulse">
        <div className="h-36 card" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-3 gap-4 lg:col-span-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 card" />)}
          </div>
          <div className="space-y-4">
            <div className="h-32 card" />
            <div className="h-32 card" />
          </div>
        </div>
        <div className="h-48 card" />
      </div>
    </PageContainer>
  )
}

export function MaleUserProfilePage() {
  const { userId } = useParams()
  const { data, loading, error } = useAdminQuery(fetchMaleProfile(userId), [userId])

  if (loading) return <PageSkeleton />

  if (error || !data?.user) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bento-card rounded-xl p-8 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-critical/10 text-critical rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="type-headline-lg text-ink">User Profile Not Found</h3>
          <p className="type-body-md text-ink-2">
            This male user profile does not exist or could not be loaded.
          </p>
          <Link to="/users" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-white" />
            Back to User Directory
          </Link>
        </div>
      </PageContainer>
    )
  }

  const { user, payments, chats } = data
  const males = Array.isArray(user.males) ? user.males[0] : user.males
  const totalRevenuePaisa = payments.reduce((s, p) => s + (p.amount_paisa || 0), 0)

  const financialStats = [
    { label: 'Coin Balance', value: `${(males?.coin_balance ?? 0).toLocaleString('en-IN')}`, icon: 'account_balance', accent: 'primary' },
    { label: 'Coins Purchased', value: `${(males?.total_coins_purchased ?? 0).toLocaleString('en-IN')}`, icon: 'shopping_bag', accent: 'secondary' },
    { label: 'Coins Spent', value: `${(males?.total_coins_spent ?? 0).toLocaleString('en-IN')}`, icon: 'payments', accent: 'tertiary' },
    { label: 'Total Spent (INR)', value: formatRupees(totalRevenuePaisa), icon: 'currency_rupee', accent: 'neutral' },
    { label: 'Purchase Count', value: String(payments.length), icon: 'receipt_long', accent: 'neutral' },
    { label: 'Chats Initiated', value: `${(males?.chats_initiated ?? 0).toLocaleString('en-IN')}`, icon: 'forum', accent: 'accent' },
  ]

  const completedChats = chats.filter(c => c.status === 'completed')
  const totalDurationMs = completedChats.reduce((s, c) => {
    if (!c.started_at || !c.ended_at) return s
    return s + (new Date(c.ended_at) - new Date(c.started_at))
  }, 0)
  const totalMin = Math.round(totalDurationMs / 60000)
  const durationLabel = totalMin > 0 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : '—'

  const chatMetrics = [
    { label: 'Total Chats', value: String(males?.chats_initiated ?? 0), icon: 'forum' },
    { label: 'Total Duration', value: durationLabel, icon: 'schedule' },
  ]

  const accountInfo = [
    { icon: 'call', label: 'Phone Number', value: formatPhone(user.phone) },
    { icon: 'calendar_today', label: 'Joined At', value: formatDate(user.created_at) },
    { icon: 'cake', label: 'Age', value: user.age ? `${user.age} years` : '—' },
  ]

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <AnimatedCardEntrance delay={0}>
          <UserProfileHeader
            avatarUrl={user.profile_picture_url}
            avatarAlt={`${user.name} profile`}
            username={user.name}
            gender="male"
            age={user.age}
            userId={shortId(user.id)}
          />
        </AnimatedCardEntrance>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            {financialStats.map((stat, i) => (
              <AnimatedCardEntrance key={stat.label} delay={0.2 + i * 0.07}>
                <ProfileStatCard {...stat} />
              </AnimatedCardEntrance>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatedCardEntrance delay={0.5}>
              <ChatEngagementCard metrics={chatMetrics} />
            </AnimatedCardEntrance>
            <AnimatedCardEntrance delay={0.6}>
              <AccountInfoCard items={accountInfo} />
            </AnimatedCardEntrance>
          </div>
        </div>

        {payments.length > 0 && (
          <AnimatedCardEntrance delay={0.7}>
            <section className="table-shell">
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <h4 className="type-headline-md text-ink">Payment History</h4>
                <span className="text-sm text-ink-2">{payments.length} transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-canvas-sunk">
                    <tr className="table-head">
                      {['Transaction ID', 'Coins', 'Amount', 'Date', 'Status'].map((col) => (
                        <th key={col} className="px-6 py-3 uppercase">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {payments.map((p) => (
                      <tr key={p.id} className="table-row">
                        <td className="table-cell-mono px-6 py-4 text-ink-2">#{shortId(p.id)}</td>
                        <td className="type-body-md px-6 py-4 font-semibold text-ink">
                          +{p.coins_to_credit?.toLocaleString('en-IN')} coins
                        </td>
                        <td className="type-body-md px-6 py-4 font-semibold text-ink">
                          {formatRupees(p.amount_paisa)}
                        </td>
                        <td className="type-body-md px-6 py-4 text-ink-2">{formatDate(p.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className="badge-transaction-success">Captured</span>
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
  )
}
