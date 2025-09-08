import { useEffect, useState } from "react";
import "../styles/Toast.css";

export function Toast({ message, type = "success" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Start exit animation before unmount
    const exitTimer = setTimeout(() => setIsVisible(false), 2700);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-icon">
        {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      </div>
      <span className="toast-message">{message}</span>
    </div>
  );
}