import { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

/**
 * One message in a chat replay.
 *
 * Media is deliberately capped in BOTH dimensions. It used to render at
 * `w-full` with `h-auto`, so a single tall photo filled the entire transcript
 * viewport and pushed every other message out of view.
 *
 * Media is served from a separate host (media.dangg.app) which can fail
 * independently of the app — expired object, CSP, network. When it does we
 * show a labelled fallback with a direct link instead of an empty frame, so an
 * admin can tell "this message had a photo we can't render" apart from "this
 * message had nothing".
 */
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
  const [mediaFailed, setMediaFailed] = useState(false);

  const rowClass = outgoing
    ? 'chat-message-row chat-message-row-outgoing'
    : 'chat-message-row';
  const bubbleClass = outgoing ? 'chat-bubble-outgoing' : 'chat-bubble-incoming';
  const timeClass = outgoing ? 'chat-bubble-time-outgoing' : 'chat-bubble-time-incoming';
  const alignClass = outgoing ? 'flex min-w-0 flex-col items-end' : 'flex min-w-0 flex-col items-start';

  const mediaUrl = videoUrl || imageUrl;
  const caption = videoUrl ? videoCaption : imageCaption;
  const kind = videoUrl ? 'video' : 'photo';

  function renderMedia() {
    if (mediaFailed) {
      return (
        <div className="chat-media-frame chat-media-fallback">
          <MaterialIcon name="broken_image" className="!text-[20px] text-ink-3" />
          <span>
            This {kind} could not be loaded.{' '}
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ember underline underline-offset-2"
            >
              Open directly
            </a>
          </span>
        </div>
      );
    }

    if (videoUrl) {
      return (
        <div className="chat-media-frame">
          <video
            src={videoUrl}
            controls
            preload="metadata"
            playsInline
            className="chat-media-video"
            onError={() => setMediaFailed(true)}
          />
        </div>
      );
    }

    return (
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-media-frame block w-max max-w-full"
        title="Open full size"
      >
        <img
          src={imageUrl}
          alt={imageAlt || 'Shared photo'}
          loading="lazy"
          className="chat-media-img"
          onError={() => setMediaFailed(true)}
        />
      </a>
    );
  }

  return (
    <div className={rowClass}>
      <img src={avatarUrl} alt={avatarAlt} className="chat-message-avatar" />
      <div className={`${alignClass} space-y-1`}>
        {mediaUrl ? (
          <div className={`${bubbleClass} !p-1.5`}>
            {renderMedia()}
            {caption && <p className="chat-media-caption">{caption}</p>}
          </div>
        ) : (
          <div className={bubbleClass}>
            <p className="type-body-md normal-case">{message}</p>
          </div>
        )}
        <span className={`chat-bubble-time ${timeClass}`}>{time}</span>
      </div>
    </div>
  );
}
