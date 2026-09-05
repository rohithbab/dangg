export function AvatarChip({ initials, name, role }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-xs font-bold text-white">
        {initials}
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{name}</p>
        <p className="text-xs text-ink-2">{role}</p>
      </div>
    </div>
  );
}
