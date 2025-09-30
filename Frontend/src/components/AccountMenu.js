import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import "../styles/AccountMenu.css";

export function AccountMenu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserName(loginForm.email.split("@")[0]);
    setLoginForm({ email: "", password: "" });
    setShowLoginModal(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserName(registerForm.name || registerForm.email.split("@")[0]);
    setRegisterForm({ name: "", email: "", password: "" });
    setShowRegisterModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("User");
    setShowUserMenu(false);
  };

  // Nếu chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <>
        <div className="auth-buttons">
          <button className="auth-button login-btn" onClick={() => setShowLoginModal(true)}>
            < FaUser />
            Login
          </button>
          <button className="auth-button register-btn" onClick={() => setShowRegisterModal(true)}>
            < FaPlus />
            Register
          </button>
        </div>

        {showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Login to your account</h3>
                <button className="close-button" onClick={() => setShowLoginModal(false)}>✕</button>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">Login</button>
              </form>
            </div>
          </div>
        )}

        {showRegisterModal && (
          <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create an account</h3>
                <button className="close-button" onClick={() => setShowRegisterModal(false)}>✕</button>
              </div>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">Register</button>
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
      <button className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
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
            onClick={() => { setShowUserMenu(false); navigate("/profile"); }}
          >
            👤 Profile
          </button>

          <button
            className="dropdown-item"
            onClick={() => { setShowUserMenu(false); navigate("/settings"); }}
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
