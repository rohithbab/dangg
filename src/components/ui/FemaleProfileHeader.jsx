import { StatusBadge } from './StatusBadge';

export function FemaleProfileHeader({
  avatarUrl,
  avatarAlt = '',
  name,
  age,
  userId,
  status = 'VERIFIED',
  statusTone = 'text-emerald-600',
  userStatus = 'active',
  onViewVerification,
}) {
  return (
    <section className="profile-header-card">
      <div className="profile-header-accent" aria-hidden />
      <div className="relative shrink-0">
        <img src={avatarUrl} alt={avatarAlt} className="profile-avatar-round" />
        <div className="profile-status-dot" title="Online Status" />
      </div>

      <div className="relative z-10 flex-1 text-center md:text-left">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <h2 className="type-headline-lg text-on-surface">{name}</h2>
          <span className="badge-gender-chip-female">Female</span>
          <span className="badge-age-pill">Age: {age}</span>
        </div>
        <p className="type-body-md mb-4 font-medium normal-case text-on-surface-variant">
          User ID: #{userId}
        </p>
        <button type="button" className="btn-verification-photo" onClick={onViewVerification}>
          View Verification Photo
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 text-center md:items-end md:text-right">
        <StatusBadge variant={userStatus.toLowerCase()}>
          {userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
        </StatusBadge>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            Account Status
          </p>
          <p className={`type-headline-md font-bold ${statusTone}`}>{status}</p>
        </div>
      </div>
    </section>
  );
}
