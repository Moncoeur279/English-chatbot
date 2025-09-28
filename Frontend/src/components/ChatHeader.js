import { useNavigate } from "react-router-dom";
import "../styles/ChatHeader.css";
import { AccountMenu } from "./AccountMenu";

export function ChatHeader({ title = "AI Assistant", subtitle = "Always here to help" }) {
  const navigate = useNavigate();

  return (
    <div className="chat-header">
      <div className="chat-title">
        <h2>{title}</h2>
        <p className="chat-subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
        <button className="action-button dictionary-btn" onClick={() => navigate("/dictionary")}>
          📚 Dictionary
        </button>
        <AccountMenu />
      </div>
    </div>
  );
}
