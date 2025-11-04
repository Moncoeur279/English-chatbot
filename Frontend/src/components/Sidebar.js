import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  // ✅ Lấy danh sách conversation khi mount
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:3030/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("Load conversations error:", err))
      .finally(() => setLoading(false));
  }, [token]);

  // ➕ Tạo mới chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3030/conversations",
        { title: "New Chat" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations([res.data, ...conversations]);
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      console.error("Create conversation error:", err);
    }
  };

  // 🗑️ Xóa chat
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await axios.delete(`http://localhost:3030/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(conversations.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete conversation error:", err);
    }
  };

  if (!token)
    return (
      <div className="sidebar-empty">
        <p>Please login to view conversations</p>
      </div>
    );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>💬 Conversations</h2>
        <button className="new-chat-btn" onClick={handleNewChat}>
          ➕
        </button>
      </div>

      {loading ? (
        <div className="sidebar-empty">Loading...</div>
      ) : conversations.length === 0 ? (
        <div className="sidebar-empty">No conversations yet</div>
      ) : (
        <ul className="conversation-list">
          {conversations.map((c) => (
            <li key={c.id} className="conversation-item">
              <div
                className="conversation-info"
                onClick={() => navigate(`/chat/${c.id}`)}
              >
                <div className="conversation-title">
                  {c.title || "Untitled Chat"}
                </div>
                <div className="conversation-time">
                  {new Date(c.lastMessageAt || c.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                className="conversation-menu"
                onClick={() => handleDelete(c.id)}
              >
                <FiMoreVertical />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
