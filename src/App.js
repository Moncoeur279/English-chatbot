import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { Toast } from "./components/Toast";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today? 💙",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [toasts, setToasts] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showToast = (message, type = "success") => {
    const id = Date.now().toString();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! 🤔 Let me help you with that.",
        "I love helping with professional conversations! 💼 What else would you like to know?",
        "Great message! ✨ I'm here to assist you with anything you need.",
        "Thanks for sharing! 🌟 This clean interface makes chatting efficient and pleasant!",
        "I appreciate your message! 💙 How else can I help you today?"
      ];

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleLogin = (email, password) => {
    setIsLoggedIn(true);
    setUserName(email.split('@')[0]);
    showToast("Successfully logged in! Welcome back! 🎉");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    showToast("Successfully logged out! See you soon! 👋");
  };

  const handleRegister = (email, password, name) => {
    setIsLoggedIn(true);
    setUserName(name);
    showToast("Account created successfully! Welcome aboard! 🚀");
  };

  const handleWordLookup = (word) => {
    showToast(`Looking up "${word}" in the dictionary! 📚`);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-card">
          <ChatHeader
            isLoggedIn={isLoggedIn}
            userName={userName}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onRegister={handleRegister}
            onWordLookup={handleWordLookup}
          />

          <div className="messages-container">
            <div className="messages-list">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    <span>AI</span>
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            placeholder="Type your message..."
          />
        </div>
      </div>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
}