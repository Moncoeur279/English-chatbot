import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ChatMessage.css";

export default function ChatMain() {
  const { id } = useParams(); // conversationId
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  // 📥 Lấy tin nhắn khi vào trang /chat/:id
  useEffect(() => {
    if (!id || !token) return;
    axios
      .get(`http://localhost:3030/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Load messages error:", err));
  }, [id, token]);

  // 🔽 Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 🚀 Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    const userText = text.trim();
    if (!userText) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const tempId = Date.now();

    // Hiển thị tin nhắn người dùng tạm thời
    const newMsg = {
      id: tempId,
      role: "user",
      content: userText,
      createdAt: now,
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:3030/messages",
        { conversationId: id, content: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // API trả về 2 message: userMsg & botReply
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempId),
        res.data.userMsg,
        res.data.botReply,
      ]);
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: tempId + 1,
          role: "assistant",
          content: "⚠️ Error: Cannot connect to server.",
          createdAt: now,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-main">
      <div ref={listRef} className="messages-list">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message ${
              m.role === "user" ? "user-message" : "ai-message"
            }`}
          >
            <div className="message-avatar">
              <span>{m.role === "user" ? "U" : "AI"}</span>
            </div>
            <div className="message-content">
              <div className="message-bubble">{m.content}</div>
              <div className="message-timestamp">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message ai-message">
            <div className="message-avatar">
              <span>AI</span>
            </div>
            <div className="message-content">
              <div className="message-bubble">Typing…</div>
            </div>
          </div>
        )}
      </div>

      {/* Ô nhập */}
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
