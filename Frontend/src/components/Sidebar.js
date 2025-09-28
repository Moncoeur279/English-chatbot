import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([
        { id: 1, title: "Welcome Chat", lastUpdated: "10:00 AM" },
        { id: 2, title: "Practice English", lastUpdated: "Yesterday" },
    ]);

    const handleNewChat = () => {
        const newId = Date.now();
        const newConvo = {
            id: newId,
            title: "New Chat",
            lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setConversations((prev) => [newConvo, ...prev]);
        navigate(`/chat/${newId}`);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>💬 Conversations</h2>
                <button className="new-chat-btn" onClick={handleNewChat}>➕</button>
            </div>

            <ul className="conversation-list">
                {conversations.map((c) => (
                    <li
                        key={c.id}
                        className="conversation-item"
                        onClick={() => navigate(`/chat/${c.id}`)}
                    >
                        <div className="conversation-title">{c.title}</div>
                        <div className="conversation-time">{c.lastUpdated}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
