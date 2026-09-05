const AVATAR_CLASSES = {
  secondary: 'user-avatar-secondary',
  tertiary: 'user-avatar-tertiary',
  primary: 'user-avatar-primary',
  accent: 'user-avatar-accent',
  error: 'user-avatar-error',
};

export function UserIdentityCell({ initials, name, email, avatarVariant = 'secondary' }) {
  const avatarClass = AVATAR_CLASSES[avatarVariant] ?? AVATAR_CLASSES.secondary;

  return (
    <div className="flex items-center gap-4">
      <div className={avatarClass}>{initials}</div>
      <div>
        <p className="type-body-md font-bold normal-case text-ink">{name}</p>
        <p className="font-label-sm text-label-sm normal-case text-ink-2">{email}</p>
      </div>
    </div>
  );
}
