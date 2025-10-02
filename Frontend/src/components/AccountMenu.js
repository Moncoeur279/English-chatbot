import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AccountMenu.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3030";

export function AccountMenu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verifyForm, setVerifyForm] = useState({ email: "", code: "" });

  // ===== LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, loginForm);
      const { user, accessToken } = res.data;

      localStorage.setItem("accessToken", accessToken);

      setIsLoggedIn(true);
      setUserName(user.name || user.email.split("@")[0]);
      setLoginForm({ email: "", password: "" });
      setShowLoginModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // ===== REGISTER → mở Verify =====
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, registerForm);
      alert(res.data.message); // "Check your email for the 6-digit code"

      setVerifyForm({ email: registerForm.email, code: "" });
      setShowRegisterModal(false);
      setShowVerifyModal(true); // mở modal verify ngay sau khi đăng ký
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  // ===== VERIFY EMAIL =====
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-email`, verifyForm);
      const { user, accessToken } = res.data;

      localStorage.setItem("accessToken", accessToken);

      setIsLoggedIn(true);
      setUserName(user.name || user.email.split("@")[0]);
      setShowVerifyModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Verify failed");
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserName("User");
    setShowUserMenu(false);
  };

  // ================= UI =================
  if (!isLoggedIn) {
    return (
      <>
        <div className="auth-buttons">
          <button
            className="auth-button login-btn"
            onClick={() => setShowLoginModal(true)}
          >
            👤 Login
          </button>
          <button
            className="auth-button register-btn"
            onClick={() => setShowRegisterModal(true)}
          >
            ➕ Register
          </button>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowLoginModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Login to your account</h3>
                <button
                  className="close-button"
                  onClick={() => setShowLoginModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowRegisterModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create an account</h3>
                <button
                  className="close-button"
                  onClick={() => setShowRegisterModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Register
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Verify Modal */}
        {showVerifyModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowVerifyModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Verify your email</h3>
                <button
                  className="close-button"
                  onClick={() => setShowVerifyModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleVerify} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={verifyForm.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    value={verifyForm.code}
                    onChange={(e) =>
                      setVerifyForm({ ...verifyForm, code: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Verify
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // Nếu đã đăng nhập
  return (
    <div className="user-menu-container">
      <button
        className="user-avatar"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        {userName.charAt(0).toUpperCase()}
      </button>
      {showUserMenu && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-email">{userName}@example.com</div>
          </div>
          <div className="dropdown-divider"></div>
          <button
            className="dropdown-item"
            onClick={() => {
              setShowUserMenu(false);
              navigate("/profile");
            }}
          >
            👤 Profile
          </button>
          <button
            className="dropdown-item"
            onClick={() => {
              setShowUserMenu(false);
              navigate("/settings");
            }}
          >
            ⚙️ Settings
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item logout-item" onClick={handleLogout}>
            🚪 Log out
          </button>
        </div>
      )}
    </div>
  );
}
