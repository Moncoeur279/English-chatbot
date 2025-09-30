import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChatMessage.css";
import "../styles/ChatInput.css";

// --- tiny demo checker: bạn sẽ thay bằng API thật sau ---
function grammarCheck(text) {
  // ví dụ: "how is you" -> gợi ý "are" cho từ "is"
  const idx = text.toLowerCase().indexOf("how is you");
  if (idx !== -1) {
    const start = text.toLowerCase().indexOf(" is ", idx) + 1; // bắt đầu tại "is"
    return [
      {
        id: "c1",
        label: "Correct subject-verb agreement",
        error: "is",
        suggestion: "are",
        reason: "Plural subject → use “are”.",
        start,
        end: start + 2,
      },
    ];
  }
  return [];
}

export default function ChatMain() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm your AI assistant. 💙`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      corrections: [],
    },
  ]);

  const listRef = useRef(null);

  // popover state (cố định khi click)
  const [activePop, setActivePop] = useState(
    /** { msgId, corrId, rect:{top,left,bottom,right}, data } | null */
    null
  );

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, id]);

  // click ngoài để đóng
  useEffect(() => {
    function onDocClick(e) {
      if (!activePop) return;
      const pop = document.getElementById("grammar-popover");
      if (pop && !pop.contains(e.target)) setActivePop(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [activePop]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const corrections = grammarCheck(text);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, isUser: true, timestamp: now, corrections },
    ]);
    setText("");
  };

  // apply 1 đề xuất → thay đoạn text và cập nhật các ranges còn lại
  const applyCorrection = (msgId, corrId) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const corr = m.corrections.find((c) => c.id === corrId);
        if (!corr) return m;

        const before = m.text.slice(0, corr.start);
        const after = m.text.slice(corr.end);
        const newText = before + corr.suggestion + after;

        const delta = corr.suggestion.length - (corr.end - corr.start);
        const newCorrs = m.corrections
          .filter((c) => c.id !== corrId)
          .map((c) => {
            if (c.start >= corr.end) {
              // đẩy các range phía sau
              return { ...c, start: c.start + delta, end: c.end + delta };
            }
            return c;
          });

        return { ...m, text: newText, corrections: newCorrs };
      })
    );
    setActivePop(null);
  };

  // render text + highlight
  const renderWithHighlights = (m) => {
    if (!m.corrections?.length) return m.text;

    const pieces = [];
    let last = 0;
    const sorted = [...m.corrections].sort((a, b) => a.start - b.start);

    sorted.forEach((c, i) => {
      if (last < c.start) pieces.push(<span key={`t-${i}`}>{m.text.slice(last, c.start)}</span>);

      pieces.push(
        <span
          key={`c-${c.id}`}
          className="grammar-error"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setActivePop({
              msgId: m.id,
              corrId: c.id,
              rect,
              data: c,
            });
          }}
        >
          {m.text.slice(c.start, c.end)}
        </span>
      );
      last = c.end;
    });

    if (last < m.text.length) pieces.push(<span key="t-last">{m.text.slice(last)}</span>);
    return pieces;
  };

  return (
    <div className="chat-main">
      <div className="messages-container">
        <div ref={listRef} className="messages-list">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.isUser ? "user-message" : "ai-message"}`}>
              <div className="message-avatar">
                <span>{m.isUser ? "U" : "AI"}</span>
              </div>
              <div className="message-content">
                <div className="message-bubble">{m.isUser ? renderWithHighlights(m) : m.text}</div>
                <div className="message-timestamp">{m.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP trắng giữ nguyên khi click */}
      {activePop && (
        <div
          id="grammar-popover"
          className="grammar-popover"
          style={{
            position: "fixed",
            top: activePop.rect.bottom + 8,
            left: Math.max(8, Math.min(activePop.rect.left, window.innerWidth - 320 - 8)),
          }}
        >
          <div className="gp-header">{activePop.data.label}</div>
          <div className="gp-suggestion">
            <span className="gp-suggest-word">{activePop.data.suggestion}</span>
          </div>
          {activePop.data.reason && <div className="gp-reason">{activePop.data.reason}</div>}
          <div className="gp-actions">
            <button className="gp-apply" onClick={() => applyCorrection(activePop.msgId, activePop.corrId)}>
              Apply
            </button>
            <button
              className="gp-dismiss"
              onClick={() => {
                // loại bỏ đề xuất này
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === activePop.msgId
                      ? { ...m, corrections: m.corrections.filter((c) => c.id !== activePop.corrId) }
                      : m
                  )
                );
                setActivePop(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
