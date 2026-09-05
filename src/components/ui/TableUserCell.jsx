export function TableUserCell({ name, avatarUrl, avatarAlt = '' }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarUrl}
        alt={avatarAlt}
        className="h-8 w-8 rounded-full border border-hairline bg-canvas-sunk object-cover"
      />
      <span className="font-semibold text-ink">{name}</span>
    </div>
  );
}
