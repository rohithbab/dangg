import { MaterialIcon } from './MaterialIcon';

export function UserProfileHeader({
  avatarUrl,
  avatarAlt = '',
  username,
  gender = 'male',
  age,
  userId,
  status = 'Active',
  statusTone = 'text-emerald-600',
  onBlock,
}) {
  return (
    <section className="bento-card flex flex-col items-center gap-8 rounded-xl p-6 md:flex-row md:items-start">
      <div className="profile-avatar-wrap">
        <img src={avatarUrl} alt={avatarAlt} className="profile-avatar" />
        <div className="profile-status-dot" title="Online Status" />
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <h3 className="type-display">{username}</h3>
            {gender === 'male' && (
              <span className="badge-gender-chip-male">
                <MaterialIcon name="male" size="sm" />
                Male
              </span>
            )}
          </div>
          <p className="mt-1 text-body-lg normal-case text-on-surface-variant">
            Age: {age} • ID:{' '}
            <span className="font-mono font-bold text-on-surface">#{userId}</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          <button type="button" className="btn-block-user" onClick={onBlock}>
            Block User
          </button>
        </div>
      </div>

      <div className="self-center md:self-start">
        <div className="profile-stat-box">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            Status
          </p>
          <p className={`type-headline-md font-bold ${statusTone}`}>{status}</p>
        </div>
      </div>
    </section>
  );
}
