import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChatMessage.css";
import "../styles/ChatInput.css";

export default function ChatMain() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [popover, setPopover] = useState(null);
  const listRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, id]);

  // ====================== GỬI TIN NHẮN ======================
  const handleSend = async (e) => {
    e.preventDefault();
    const userText = text.trim();
    if (!userText) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgId = Date.now();

    // Thêm user message
    const newMsg = {
      id: msgId,
      text: userText,
      isUser: true,
      timestamp: now,
      corrections: [],
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setIsTyping(true);

    try {
      // Gọi song song 2 API
      const [chatRes, grammarRes] = await Promise.all([
        fetch("http://localhost:3030/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText }),
        }),
        fetch("http://localhost:3030/api/grammar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText }),
        }),
      ]);

      const chatData = await chatRes.json();
      const grammarData = await grammarRes.json();

      // Gắn lỗi ngữ pháp vào message user
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
              ...m,
              corrections:
                grammarData.corrections?.map((c, i) => ({
                  id: i + 1,
                  original: c.original,
                  suggestion: c.suggestion,
                  reason: c.reason,
                  label: c.label,
                  applied: false,
                })) || [],
            }
            : m
        )
      );

      // Thêm phản hồi của AI
      setMessages((prev) => [
        ...prev,
        {
          id: msgId + 1,
          text: chatData.reply || "Okay!",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("Error contacting API:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: msgId + 1,
          text: "Demo phản hồi của AI",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ====================== ÁP DỤNG SỬA LỖI ======================
  const applyCorrection = (msgId, corr) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;

        // Chỉ thay đúng từ sai đầu tiên tìm thấy trong câu
        const regex = new RegExp(`\\b${escapeRegex(corr.original)}\\b`, "i");
        const newText = m.text.replace(regex, corr.suggestion);

        const updatedCorrections = m.corrections.map((c) =>
          c.id === corr.id ? { ...c, applied: true } : c
        );

        return { ...m, text: newText, corrections: updatedCorrections };
      })
    );
    setPopover(null);
  };

  // ====================== POPOVER ======================
  const handleWordClick = (e, msgId, corr) => {
    const rect = e.target.getBoundingClientRect();
    const popoverWidth = 260;
    const popoverHeight = 140;
    let x = rect.left;
    let y = rect.bottom + window.scrollY;

    if (x + popoverWidth > window.innerWidth - 20)
      x = window.innerWidth - popoverWidth - 20;
    if (y + popoverHeight > window.innerHeight + window.scrollY)
      y = rect.top + window.scrollY - popoverHeight - 10;

    setPopover({ x, y, corr, msgId });
  };

  // ====================== RENDER ======================
  return (
    <div className="chat-main">
      <div ref={listRef} className="messages-list">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.isUser ? "user-message" : "ai-message"}`}>
            <div className="message-avatar"><span>{m.isUser ? "U" : "AI"}</span></div>
            <div className="message-content">
              <div className="message-bubble">
                {m.isUser && m.corrections?.length > 0 ? (
                  <div className="highlighted-text">
                    {renderTextWithHighlights(m, handleWordClick)}
                  </div>
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
              <div className="message-timestamp">{m.timestamp}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message ai-message">
            <div className="message-avatar"><span>AI</span></div>
            <div className="message-content">
              <div className="message-bubble">Typing…</div>
            </div>
          </div>
        )}
      </div>

      {/* Popover lỗi */}
      {popover && (
        <div className="grammar-popover" style={{ top: popover.y, left: popover.x }}>
          <div className="popover-header">{popover.corr.label}</div>
          <div className="popover-body">{popover.corr.reason}</div>
          <div className="popover-suggest">
            👉 <b>{popover.corr.suggestion}</b>
          </div>
          <button onClick={() => applyCorrection(popover.msgId, popover.corr)}>Apply</button>
          <button onClick={() => setPopover(null)}>Close</button>
        </div>
      )}

      {/* Form nhập */}
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

// ====================== GẠCH CHÂN & CLICK ======================
function renderTextWithHighlights(msg, onClick) {
  let text = msg.text;

  // Duyệt từng lỗi và chèn highlight vào text
  msg.corrections.forEach((corr) => {
    const regex = new RegExp(`(${escapeRegex(corr.original)})`, "gi");
    text = text.replace(
      regex,
      `<span class="${corr.applied ? "word-fixed" : "word-error"
      }" data-id="${corr.id}">$1</span>`
    );
  });

  return (
    <span
      dangerouslySetInnerHTML={{ __html: text }}
      onClick={(e) => {
        const span = e.target.closest("span[data-id]");
        if (!span) return;
        const id = parseInt(span.getAttribute("data-id"));
        const corr = msg.corrections.find((c) => c.id === id);
        if (corr) onClick(e, msg.id, corr);
      }}
    />
  );
}

// ====================== ESCAPE REGEX ======================
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
