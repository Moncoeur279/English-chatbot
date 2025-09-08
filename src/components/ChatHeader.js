import { useState } from "react";
import { AccountMenu } from "./AccountMenu";
import { DictionaryModal } from "./DictionaryModal";
import "../styles/ChatHeader.css";

export function ChatHeader({
  title = "AI Assistant",
  subtitle = "Always here to help",
  isOnline = true,
  isLoggedIn = false,
  userName,
  onLogin,
  onLogout,
  onRegister,
  onWordLookup
}) {
  const [showDictionary, setShowDictionary] = useState(false);

  return (
    <>
      <div className="chat-header">
        <div className="header-left">
          <div className="ai-avatar">
            <span>AI</span>
          </div>
          <div className="header-info">
            <div className="header-title-row">
              <h2 className="header-title">{title}</h2>
              <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <p className="header-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="action-button dictionary-btn"
            onClick={() => setShowDictionary(true)}
          >
            📚 Dictionary
          </button>
          <AccountMenu
            isLoggedIn={isLoggedIn}
            userName={userName}
            onLogin={onLogin}
            onLogout={onLogout}
            onRegister={onRegister}
          />
        </div>
      </div>

      {showDictionary && (
        <DictionaryModal
          onClose={() => setShowDictionary(false)}
          onWordLookup={onWordLookup}
        />
      )}
    </>
  );
}