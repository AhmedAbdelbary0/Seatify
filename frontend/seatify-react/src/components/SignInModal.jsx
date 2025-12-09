import React, { useState } from "react";
import "../styles/style.css";
import api from "../api/axios";

function SignInModal({
  isOpen,
  onClose,
  onSignIn,
  onSwitchToSignUp,
  onForgotPassword,
  onSignInSuccess, // optional
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setError("");
      // 🔹 FIX: include /api/v1 prefix
      const response = await api.post("/api/v1/auth/login", { email, password });
      // cookies are set by backend; accessToken in body is optional now

      const user = response.data?.data?.user || null;

      // 🔹 prefer onSignInSuccess if provided (HomePage uses this)
      if (typeof onSignInSuccess === "function") {
        await onSignInSuccess(user);
      } else if (typeof onSignIn === "function") {
        // fallback for Navbar usage
        await onSignIn(user);
      }

      // only close if parent didn't already close it
      if (typeof onClose === "function") onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Sign-in failed. Please try again."
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign In</h2>
        <p>Sign in to your account to continue</p>
        {error && <p className="error-message">{error}</p>}
        <form className="signin-form" onSubmit={handleSignIn}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a
            href="#"
            className="forgot-password"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onForgotPassword === "function") onForgotPassword();
            }}
          >
            Forgot your password?
          </a>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Sign In
            </button>
          </div>
          <p className="signin-footer">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onSwitchToSignUp();
              }}
            >
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
