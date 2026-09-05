import { MaterialIcon } from './MaterialIcon';

export function ChatReplayFooter({
  placeholder = 'This is a replay of a closed conversation...',
  onPrint,
}) {
  return (
    <footer className="chat-replay-footer">
      {/* Matches .chat-replay-thread so the footer lines up with the messages
          instead of stretching the full width of a wide screen. */}
      <div className="mx-auto w-full max-w-3xl space-y-2">
      <div className="chat-replay-input">
        <span className="text-sm text-ink-2">{placeholder}</span>
        <MaterialIcon name="lock" className="text-ink-2" />
      </div>
      <div className="flex gap-2">
        <button type="button" className="btn-replay-icon" title="Print" onClick={onPrint}>
          <MaterialIcon name="print" />
        </button>
        <button type="button" className="btn-reopen-chat" disabled>
          Reopen Chat
        </button>
      </div>
      </div>
    </footer>
  );
}
