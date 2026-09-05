export function ChatStatusBanner({ message }) {
  return (
    <div className="chat-status-banner">
      <div className="chat-status-pill">
        <span className="status-dot-online" />
        <span className="text-xs font-semibold text-ink-2">{message}</span>
      </div>
    </div>
  );
}
