import { useState } from "react";
import "../styles/AccountMenu.css";

export function AccountMenu({
  isLoggedIn,
  userName = "User",
  onLogin,
  onLogout,
  onRegister
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(loginForm.email, loginForm.password);
    setLoginForm({ email: "", password: "" });
    setShowLoginModal(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    onRegister(registerForm.email, registerForm.password, registerForm.name);
    setRegisterForm({ name: "", email: "", password: "" });
    setShowRegisterModal(false);
  };

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

        {showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
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
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
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

        {showRegisterModal && (
          <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
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
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
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
      </>
    );
  }

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
            <div className="user-email">user@example.com</div>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item">
            👤 Profile
          </button>
          <button className="dropdown-item">
            ⚙️ Settings
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item logout-item" onClick={onLogout}>
            🚪 Log out
          </button>
        </div>
      )}
    </div>
  );
}