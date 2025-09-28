import { useEffect, useState } from "react";
import "../styles/Toast.css";

export function Toast() {
  const [toasts, setToasts] = useState([]);

  // Tạo 1 toast demo khi component mount
  useEffect(() => {
    const id = Date.now().toString();
    const demoToast = { id, message: "Welcome to the app! 🎉", type: "success" };
    setToasts([demoToast]);

    // Xoá sau 3s
    const timer = setTimeout(() => {
      setToasts([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type} toast-visible`}
        >
          <div className="toast-icon">
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </div>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
