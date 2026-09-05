import { MaterialIcon } from './MaterialIcon';

export function VerificationRequestCard({
  id,
  name,
  phone,
  imageUrl,
  imageAlt = '',
  hasVerificationPhoto,
  actionLoading,
  onApprove,
  onReject,
}) {
  const approving = actionLoading === 'approve'
  const rejecting = actionLoading === 'reject'
  const busy = approving || rejecting

  return (
    <article className="verification-card group">
      <div
        className="verification-photo-wrap relative cursor-pointer group/photo"
        onClick={() => imageUrl && window.open(imageUrl, '_blank', 'noopener,noreferrer')}
        title={imageUrl ? 'Click to open full photo' : undefined}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={imageAlt} className="verification-photo transition-opacity group-hover/photo:opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity bg-black/20 rounded-xl">
              <MaterialIcon name="open_in_new" className="!text-2xl text-white drop-shadow" />
            </div>
          </>
        ) : (
          <div className="verification-photo flex items-center justify-center bg-surface-container">
            <MaterialIcon name="person" className="!text-6xl text-on-surface-variant/30" />
          </div>
        )}
        <span className="verification-id-badge">ID: #{id}</span>
        {hasVerificationPhoto === false && imageUrl && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
            Profile pic
          </span>
        )}
      </div>
      <div className="mb-6 space-y-1">
        <h3 className="type-headline-md text-on-surface">{name}</h3>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <MaterialIcon name="phone" className="text-[18px]" />
          <p className="type-body-md normal-case">{phone}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="btn-verify-approve flex items-center gap-2 disabled:opacity-60"
          onClick={onApprove}
          disabled={busy}
        >
          {approving ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <MaterialIcon name="check" className="text-[18px]" />
          )}
          {approving ? 'Approving…' : 'Approve'}
        </button>
        <button
          type="button"
          className="btn-verify-reject flex items-center gap-2 disabled:opacity-60"
          onClick={onReject}
          disabled={busy}
        >
          {rejecting ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <MaterialIcon name="close" className="text-[18px]" />
          )}
          {rejecting ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
    </article>
  );
}
