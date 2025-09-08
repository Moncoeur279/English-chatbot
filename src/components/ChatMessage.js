import "../styles/ChatMessage.css";

export function ChatMessage({ message, isUser, timestamp }) {
  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        <span>{isUser ? "U" : "AI"}</span>
      </div>

      <div className="message-content">
        <div className="message-bubble">
          {message}
        </div>
        {timestamp && (
          <div className="message-timestamp">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}