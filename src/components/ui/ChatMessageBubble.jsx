export function ChatMessageBubble({
  avatarUrl,
  avatarAlt = '',
  message,
  time,
  outgoing = false,
  imageUrl,
  imageAlt = '',
  imageCaption,
  videoUrl,
  videoCaption,
}) {
  const rowClass = outgoing
    ? 'chat-message-row chat-message-row-outgoing'
    : 'chat-message-row';
  const bubbleClass = outgoing ? 'chat-bubble-outgoing' : 'chat-bubble-incoming';
  const timeClass = outgoing ? 'chat-bubble-time-outgoing' : 'chat-bubble-time-incoming';
  const alignClass = outgoing ? 'flex flex-col items-end' : '';

  return (
    <div className={rowClass}>
      <img src={avatarUrl} alt={avatarAlt} className="chat-message-avatar" />
      <div className={`space-y-1 ${alignClass}`.trim()}>
        {videoUrl ? (
          <div className={`${bubbleClass} space-y-3 !p-2`}>
            {videoCaption && (
              <p className="type-body-md px-2 pt-2 normal-case text-ink font-medium">{videoCaption}</p>
            )}
            <div className="overflow-hidden rounded-xl border border-hairline/60 shadow-inner">
              <video
                src={videoUrl}
                controls
                playsInline
                className="h-auto w-full max-h-72 object-contain bg-black"
              />
            </div>
          </div>
        ) : imageUrl ? (
          <div className={`${bubbleClass} space-y-3 !p-2`}>
            {imageCaption && (
              <p className="type-body-md px-2 pt-2 normal-case text-ink font-medium">{imageCaption}</p>
            )}
            <div className="overflow-hidden rounded-xl border border-hairline/60 shadow-inner">
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} alt={imageAlt} className="h-auto w-full object-cover cursor-pointer hover:opacity-90 transition-opacity" />
              </a>
            </div>
          </div>
        ) : (
          <div className={bubbleClass}>
            <p className={`type-body-md normal-case ${outgoing ? 'text-ink' : 'text-ink font-medium'}`}>{message}</p>
          </div>
        )}
        <span className={`chat-bubble-time ${timeClass}`}>{time}</span>
      </div>
    </div>
  );
}
