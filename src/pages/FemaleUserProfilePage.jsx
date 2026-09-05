import { useParams, Link } from 'react-router-dom';
import { useCallback } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { FemaleProfileHeader } from '../components/ui/FemaleProfileHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EarningsStatCard } from '../components/ui/EarningsStatCard';
import { ChatMetricCard } from '../components/ui/ChatMetricCard';
import { AccountInfoPanel } from '../components/ui/AccountInfoPanel';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { AnimatedCardEntrance, AnimatedStaggerGroup } from '../components/animation';
import { useAdminQuery } from '../hooks/useAdminQuery';
import { adminApi } from '../lib/adminApi';
import { formatRupees, formatDate, formatPhone, shortId } from '../lib/utils';

const VERIFICATION_STATUS_TONE = {
  verified: 'text-emerald-600',
  pending: 'text-amber-500',
  rejected: 'text-red-500',
  unverified: 'text-ink-2',
};

function fetchFemaleProfile(userId) {
  return async function fetchFemaleProfileQuery() {
    return adminApi('userProfile', { userId, role: 'female' })
  }
}

function PageSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-10 animate-pulse">
        <div className="h-36 card" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 card" />)}
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="h-40 card" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-48 card" />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

function statusVariant(status) {
  if (status === 'completed') return 'badge-transaction-success'
  if (status === 'pending' || status === 'approved') return 'badge-status-stable'
  return 'badge-status-inactive'
}

export function FemaleUserProfilePage() {
  const { userId } = useParams()
  const { data, loading, error } = useAdminQuery(fetchFemaleProfile(userId), [userId])

  /* Every hook must run before any early return, or React sees a different
     hook count between renders ("Rendered more hooks than during the previous
     render") and unmounts the page. `females` is read defensively because on
     the first render `data` is still null. */
  const rawFemales = data?.user?.females
  const femalesForPhoto = Array.isArray(rawFemales) ? rawFemales[0] : rawFemales

  /* The signed URL is minted server-side: the browser has no storage
     credential, and the path is never trusted from the client — admin-api
     looks it up from the female id. */
  const handleViewVerificationPhoto = useCallback(async () => {
    if (!femalesForPhoto?.verification_photo_path) return
    try {
      const { url } = await adminApi('verificationPhotoUrl', { femaleId: userId })
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      /* Nothing actionable for the admin here; the button simply does nothing
         rather than showing a scary error for a missing photo. */
    }
  }, [femalesForPhoto, userId])

  if (loading) return <PageSkeleton />

  if (error || !data?.user) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="account-info-panel rounded-xl p-8 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-critical/10 text-critical rounded-full flex items-center justify-center mx-auto">
            <MaterialIcon name="error_outline" className="text-4xl" />
          </div>
          <h3 className="type-headline-lg text-ink">User Profile Not Found</h3>
          <p className="type-body-md text-ink-2">
            This female user profile does not exist or could not be loaded.
          </p>
          <Link to="/users" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg justify-center w-full">
            <MaterialIcon name="arrow_back" className="text-white" />
            Back to User Directory
          </Link>
        </div>
      </PageContainer>
    )
  }

  const { user, payouts } = data
  const females = Array.isArray(user.females) ? user.females[0] : user.females
  const balanceCoins = females?.earnings_balance_coins ?? 0
  const totalPayoutsPaisa = payouts
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + (p.payout_amount_paisa || 0), 0)
  const pendingPayoutsPaisa = payouts
    .filter(p => ['pending', 'approved'].includes(p.status))
    .reduce((s, p) => s + (p.payout_amount_paisa || 0), 0)

  const earningsStats = [
    { label: 'Balance', value: formatRupees(balanceCoins * 4), badge: `${balanceCoins.toLocaleString('en-IN')} coins` },
    { label: 'Total Payouts', value: formatRupees(totalPayoutsPaisa), variant: 'accent' },
    { label: 'Pending Payouts', value: formatRupees(pendingPayoutsPaisa), valueTone: 'tertiary' },
    { label: 'Coin Price', value: `${females?.coin_price ?? 0} coins/chat`, valueTone: 'muted' },
    { label: 'Rating', value: `${(females?.rating_avg ?? 0).toFixed(1)} / 5`, variant: 'highlight' },
  ]

  const verificationStatus = females?.verification_status ?? 'unverified'

  const accountRows = [
    { label: 'Phone', value: formatPhone(user.phone) },
    { label: 'Age', value: user.age ? `${user.age} years` : '—' },
    { label: 'Joined At', value: formatDate(user.created_at) },
    { label: 'Verification', value: verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1) },
    { label: 'Online Now', value: females?.is_online ? 'Yes' : 'No' },
  ]

  return (
    <PageContainer>
      <AnimatedStaggerGroup className="space-y-10">
        <AnimatedCardEntrance delay={0}>
          <FemaleProfileHeader
            avatarUrl={user.profile_picture_url || 'https://placehold.co/96x96/e2e8f0/64748b?text=F'}
            avatarAlt={`${user.name} profile`}
            name={user.name}
            age={user.age}
            userId={shortId(user.id)}
            userStatus={females?.is_online ? 'active' : 'offline'}
            status={verificationStatus.toUpperCase()}
            statusTone={VERIFICATION_STATUS_TONE[verificationStatus] ?? 'text-ink-2'}
            onViewVerification={females?.verification_photo_path ? handleViewVerificationPhoto : undefined}
          />
        </AnimatedCardEntrance>

        <section>
          <SectionHeading icon="account_balance" title="Earnings Overview" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {earningsStats.map((item, i) => (
              <AnimatedCardEntrance key={item.label} delay={0.1 + i * 0.05}>
                <EarningsStatCard {...item} />
              </AnimatedCardEntrance>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AnimatedCardEntrance delay={0.4}>
                <ChatMetricCard
                  icon="forum"
                  label="Total Chats Received"
                  value={String(females?.total_chats ?? 0)}
                  accent="primary"
                />
              </AnimatedCardEntrance>
              <AnimatedCardEntrance delay={0.5}>
                <ChatMetricCard
                  icon="star"
                  label="Total Ratings"
                  value={String(females?.total_ratings ?? 0)}
                  accent="secondary"
                />
              </AnimatedCardEntrance>
            </div>
          </div>

          <div className="lg:col-span-4">
            <AnimatedCardEntrance delay={0.6}>
              <AccountInfoPanel rows={accountRows} onEdit={false} />
            </AnimatedCardEntrance>
          </div>
        </div>

        {payouts.length > 0 && (
          <AnimatedCardEntrance delay={0.7}>
            <section className="table-shell">
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <h4 className="type-headline-md text-ink">Payout History</h4>
                <span className="text-sm text-ink-2">{payouts.length} requests</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-canvas-sunk">
                    <tr className="table-head">
                      {['Payout ID', 'Amount', 'Method', 'Date', 'Status'].map((col) => (
                        <th key={col} className="px-6 py-3 uppercase">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {payouts.map((p) => {
                      const detail = Array.isArray(p.payout_details) ? p.payout_details[0] : p.payout_details
                      return (
                        <tr key={p.id} className="table-row">
                          <td className="table-cell-mono px-6 py-4 text-ink-2">#{shortId(p.id)}</td>
                          <td className="type-body-md px-6 py-4 font-semibold text-ink">
                            {formatRupees(p.payout_amount_paisa)}
                          </td>
                          <td className="type-body-md px-6 py-4 text-ink-2 capitalize">
                            {detail?.method || (detail?.upi_id ? 'UPI' : '—')}
                          </td>
                          <td className="type-body-md px-6 py-4 text-ink-2">{formatDate(p.requested_at)}</td>
                          <td className="px-6 py-4">
                            <span className={statusVariant(p.status)}>{p.status}</span>
                          </td>
                        </tr>
                      )
                    })}
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
