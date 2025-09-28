import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChatMessage.css";
import "../styles/ChatInput.css";

export default function ChatMain() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1, text: `Hello! I'm your AI assistant. 💙`, isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, id]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, isUser: true, timestamp: now },
    ]);
    setText("");
  };

  return (
    <div className="chat-main">
      <div className="messages-container">
        <div ref={listRef} className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.isUser ? "user-message" : "ai-message"}`}>
              <div className="message-avatar"><span>{m.isUser ? "U" : "AI"}</span></div>
              <div className="message-content">
                <div className="message-bubble">{m.text}</div>
                <div className="message-timestamp">{m.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <div className="input-container">
          <input
            className="message-input"
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="send-btn" type="submit" disabled={!text.trim()}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
